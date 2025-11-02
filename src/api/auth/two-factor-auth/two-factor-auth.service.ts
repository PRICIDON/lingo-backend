import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { TokenType } from '@prisma/client'

import { PrismaService } from '../../../infra/prisma/prisma.service'
import { MailService } from '../../../libs/mail/mail.service'

@Injectable()
export class TwoFactorAuthService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService
	) {}

	async validateTwoFactorToken(email: string, code: string) {
		const existingToken = await this.prismaService.token.findFirst({
			where: {
				email,
				type: TokenType.TWO_FACTOR
			}
		})
		if (!existingToken)
			throw new NotFoundException(
				'Токен подтверждения не найден. Пожалуйста, убедитесь, что у вас правильный токен.'
			)

		if (existingToken.token !== code)
			throw new BadRequestException(
				'Неверный код двухфакторной аутентификации. Пожалуйста, проверьте введененный код и попробуйте снова.'
			)

		const hasExpired = new Date(existingToken.expiresIn) < new Date()

		if (hasExpired)
			throw new BadRequestException(
				'Срок действия токена двухфакторной аутентификации истек. Пожалуйста, запросите новый токен.'
			)

		await this.prismaService.token.delete({
			where: {
				id: existingToken.id,
				type: TokenType.TWO_FACTOR
			}
		})

		return true
	}

	async sendTwoFactorToken(email: string) {
		const twoFactorToken = await this.generateVerificationToken(email)

		await this.mailService.sendTwoFactorTokenEmail(
			twoFactorToken.email,
			twoFactorToken.token
		)
	}

	private async generateVerificationToken(email: string) {
		const token = Math.floor(
			Math.random() * (1000000 - 100000) + 100000
		).toString()
		const expiresIn = new Date(new Date().getTime() + 300000)

		const existingToken = await this.prismaService.token.findFirst({
			where: {
				email,
				type: TokenType.TWO_FACTOR
			}
		})

		if (existingToken) {
			await this.prismaService.token.delete({
				where: {
					id: existingToken.id,
					type: TokenType.TWO_FACTOR
				}
			})
		}
		const twoFactorToken = await this.prismaService.token.create({
			data: {
				email,
				token,
				expiresIn,
				type: TokenType.TWO_FACTOR
			}
		})
		return twoFactorToken
	}
}
