import { DocumentBuilder } from '@nestjs/swagger'
import * as process from 'node:process'

export function getSwaggerConfig() {
	return new DocumentBuilder()
		.setTitle('Lingo API')
		.setVersion(process.env.npn_package_version ?? '1.0.0')
		.build()
}
