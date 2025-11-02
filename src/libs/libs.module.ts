import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { getBullmqConfig } from '../config/bullmq.config'

import { MailModule } from './mail/mail.module'

@Module({
	imports: [
		BullModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getBullmqConfig,
			inject: [ConfigService]
		}),
		MailModule
	]
})
export class LibsModule {}
