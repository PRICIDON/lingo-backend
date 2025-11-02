import { Module } from '@nestjs/common'

import { StripeModule } from '../payment/providers/stripe/stripe.module'

import { SchedulerModule } from './scheduler/scheduler.module'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
	controllers: [UsersController],
	providers: [UsersService],
	exports: [UsersService],
	imports: [SchedulerModule, StripeModule]
})
export class UsersModule {}
