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
import { isDev } from './common/utils/is-dev.util'
import { parseBoolean } from './common/utils/parse-boolean.util'
import { getCorsConfig } from './config/cors.config'
import { getSwaggerConfig } from './config/swagger.config'

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		rawBody: true
	})
	
	const config = app.get(ConfigService)
	const logger = new Logger(AppModule.name)
	const redis = createClient({
		url: config.getOrThrow<string>('REDIS_URI'),
		legacyMode: true,
		socket: {
			reconnectStrategy: (retries) => {
				const delay = Math.min(retries * 500, 5000)
				logger.warn(`🔁 Попытка переподключения к Redis (#${retries}) через ${delay} мс`);
        return delay;
			}
		}
	} as any)
	 redis.on('error', (err) => {
    logger.error(`Redis error: ${err.message}`);
  });

  redis.on('connect', () => logger.log('✅ Подключено к Redis'));
  redis.on('end', () => logger.warn('⚠️ Соединение с Redis закрыто'));
  redis.on('reconnecting', () => logger.warn('🔁 Переподключение к Redis...'));
	await redis.connect()

	app.set('trust proxy', true)

	app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')))

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true
		})
	)

	app.enableCors(getCorsConfig(config))

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
				sameSite: isDev(config) ? 'lax' : 'none'
			},
			store: new RedisStore({
				client: redis,
				prefix: config.getOrThrow<string>('SESSION_FOLDER')
			})
		})
	)

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
