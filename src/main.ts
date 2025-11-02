import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { SwaggerModule } from '@nestjs/swagger'
import { RedisStore } from 'connect-redis'
import * as cookieParser from 'cookie-parser'
import * as session from 'express-session'
import { createClient } from 'redis'

import { AppModule } from './app.module'
import { ContentRangeInterceptor } from './common/interceptors/content-range.interceptor'
import { ms, StringValue } from './common/utils/ms.util'
import { parseBoolean } from './common/utils/parse-boolean.util'
import { getCorsConfig } from './config/cors.config'
import { getSwaggerConfig } from './config/swagger.config'

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		rawBody: true
	})

	const config = app.get(ConfigService)
	const redis = createClient({
		url: config.getOrThrow<string>('REDIS_URI'),
		legacyMode: true
	} as any)
	await redis.connect()
	const logger = new Logger(AppModule.name)

	app.set('trust proxy', true)

	app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')))

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true
		})
	)

	app.use(
		session({
			secret: config.getOrThrow<string>('SESSION_SECRET'),
			name: config.getOrThrow<string>('SESSION_NAME'),
			resave: true,
			saveUninitialized: false,
			cookie: {
				domain: config.getOrThrow<string>('SESSION_DOMAIN'),
				maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
				httpOnly: parseBoolean(
					config.getOrThrow<string>('SESSION_HTTP_ONLY')
				),
				secure: parseBoolean(
					config.getOrThrow<string>('SESSION_SECURE')
				),
				sameSite: 'none'
			},
			store: new RedisStore({
				client: redis,
				prefix: config.getOrThrow<string>('SESSION_FOLDER')
			})
		})
	)

	app.enableCors(getCorsConfig(config))

	app.useGlobalInterceptors(new ContentRangeInterceptor())

	const swaggerConfig = getSwaggerConfig()
	const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig)
	SwaggerModule.setup('/docs', app, swaggerDocument, {
		jsonDocumentUrl: '/openapi.json'
	})

	const port = config.getOrThrow<number>('HTTP_PORT')
	const host = config.getOrThrow<string>('HTTP_HOST')
	try {
		await app.listen(port)
		logger.log(`Server is running at: ${host}`)
	} catch (e) {
		logger.log(`Failed to start server: ${e.message}`, e)
		process.exit(1)
	}
}
bootstrap()
