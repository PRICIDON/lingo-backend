import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Param,
	Post
} from '@nestjs/common'

import { NewPasswordRequest } from './dto/new-password.dto'
import { ResetPasswordRequest } from './dto/reset-password.dto'
import { PasswordRecoveryService } from './password-recovery.service'

@Controller('auth/password-recovery')
export class PasswordRecoveryController {
	constructor(
		private readonly passwordRecoveryService: PasswordRecoveryService
	) {}

	@Post('reset')
	@HttpCode(HttpStatus.OK)
	async resetPassword(@Body() dto: ResetPasswordRequest) {
		return await this.passwordRecoveryService.resetPassword(dto)
	}

	@Post('new/:token')
	@HttpCode(HttpStatus.OK)
	async newPassword(
		@Body() dto: NewPasswordRequest,
		@Param('token') token: string
	) {
		return await this.passwordRecoveryService.newPassword(dto, token)
	}
}
