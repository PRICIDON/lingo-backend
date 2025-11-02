import { Module } from '@nestjs/common'

import { UsersModule } from '../../users/users.module'

import { PasswordRecoveryController } from './password-recovery.controller'
import { PasswordRecoveryService } from './password-recovery.service'

@Module({
	controllers: [PasswordRecoveryController],
	providers: [PasswordRecoveryService],
	imports: [UsersModule]
})
export class PasswordRecoveryModule {}
