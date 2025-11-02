import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

import { PrismaService } from '../../../infra/prisma/prisma.service'

@Injectable()
export class SchedulerService {
	private readonly logger = new Logger(SchedulerService.name)
	constructor(private readonly prismaService: PrismaService) {}

	@Cron(CronExpression.EVERY_30_MINUTES)
	async regenerationHearts() {
		await this.prismaService.userProgress.updateMany({
			where: {
				hearts: {
					lt: 5
				}
			},
			data: {
				hearts: {
					increment: 1
				}
			}
		})
		this.logger.log('Hearts regeneration')
	}
}
