import { ConfigService } from '@nestjs/config'
import type { QueueOptions } from 'bullmq'

import { getRedisConfig } from './redis.config'

export function getBullmqConfig(configService: ConfigService): QueueOptions {
	return {
		connection: {
			maxRetriesPerRequest: null,
			retryStrategy: times => Math.min(times * 50, 2000),
			...getRedisConfig(configService),
			tls: {},
			enableReadyCheck: false,
			connectTimeout: 10000
		},
		prefix: configService.getOrThrow<string>('QUEUE_PREFIX')
	}
}
