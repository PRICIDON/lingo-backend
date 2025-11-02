import {
	BadRequestException,
	forwardRef,
	Inject,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { TokenType } from '@prisma/client'
import { Request } from 'express'
import { v4 as uuidv4 } from 'uuid'

import { PrismaService } from '../../../infra/prisma/prisma.service'
import { MailService } from '../../../libs/mail/mail.service'
import { UsersService } from '../../users/users.service'
import { AuthService } from '../auth.service'

import { ConfirmationRequest } from './dto/confirmation.dto'

@Injectable()
export class EmailConfirmationService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService,
		private readonly userService: UsersService,
		@Inject(forwardRef(() => AuthService))
		private readonly authService: AuthService
	) {}

	async newVerification(req: Request, dto: ConfirmationRequest) {
		const existingToken = await this.prismaService.token.findUnique({
			where: {
				token: dto.token,
				type: TokenType.VERIFICATION
			}
		})
		if (!existingToken)
			throw new NotFoundException(
				'Токен подтверждения не найден. Пожалуйста, убедитесь, что у вас правильный токен.'
			)

		const hasExpired = new Date(existingToken.expiresIn) < new Date()
		if (hasExpired)
			throw new BadRequestException(
				'Токен подтверждения истек. Пожалуйста, запросите новый токен для подтверждения'
			)

		const existingUser = await this.userService.findByEmail(
			existingToken.email
		)
		if (!existingUser)
			throw new NotFoundException(
				'Пользователь с указанным адресом электронной почты не найден. Пожалуйста, убедитесь, что вы ввели правильный email.'
			)

		await this.prismaService.user.update({
			where: {
				id: existingUser.id
			},
			data: {
				isVerified: true
			}
		})

		await this.prismaService.token.delete({
			where: {
				id: existingToken.id,
				type: TokenType.VERIFICATION
			}
		})

		return this.authService.saveSession(req, existingUser)
	}

	async sendVerificationToken(email: string) {
		const verificationToken = await this.generateVerificationToken(email)

		await this.mailService.sendConfirmationEmail(
			verificationToken.email,
			verificationToken.token
		)

		return true
	}

	private async generateVerificationToken(email: string) {
		const token = uuidv4()
		const expiresIn = new Date(new Date().getTime() + 3600 * 1000)

		const existingToken = await this.prismaService.token.findFirst({
			where: {
				email,
				type: TokenType.VERIFICATION
			}
		})

		if (existingToken) {
			await this.prismaService.token.delete({
				where: {
					id: existingToken.id,
					type: TokenType.VERIFICATION
				}
			})
		}
		const verificationToken = await this.prismaService.token.create({
			data: {
				email,
				token,
				expiresIn,
				type: TokenType.VERIFICATION
			}
		})
		return verificationToken
	}
}
