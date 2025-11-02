import { Module } from '@nestjs/common'

import { UsersModule } from '../users/users.module'

import { ChallengesController } from './challenges.controller'
import { ChallengesService } from './challenges.service'

@Module({
	controllers: [ChallengesController],
	providers: [ChallengesService],
	imports: [UsersModule]
})
export class ChallengesModule {}
