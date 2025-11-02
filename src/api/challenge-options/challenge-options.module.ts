import { Module } from '@nestjs/common'

import { UsersModule } from '../users/users.module'

import { ChallengeOptionsController } from './challenge-options.controller'
import { ChallengeOptionsService } from './challenge-options.service'

@Module({
	controllers: [ChallengeOptionsController],
	providers: [ChallengeOptionsService],
	imports: [UsersModule]
})
export class ChallengeOptionsModule {}
