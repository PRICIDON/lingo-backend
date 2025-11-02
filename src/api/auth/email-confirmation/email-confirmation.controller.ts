import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Req
} from '@nestjs/common'
import { Request } from 'express'

import { ConfirmationRequest } from './dto/confirmation.dto'
import { EmailConfirmationService } from './email-confirmation.service'

@Controller('auth/email-confirmation')
export class EmailConfirmationController {
	constructor(
		private readonly emailConfirmationService: EmailConfirmationService
	) {}

	@Post()
	@HttpCode(HttpStatus.OK)
	async newVerification(
		@Req() req: Request,
		@Body() dto: ConfirmationRequest
	) {
		return await this.emailConfirmationService.newVerification(req, dto)
	}
}
