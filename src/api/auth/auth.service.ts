import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthMethod, User } from '@prisma/client'
import { verify } from 'argon2'
import { Request, Response } from 'express'

import { ms, StringValue } from '../../common/utils/ms.util'
import { parseBoolean } from '../../common/utils/parse-boolean.util'
import { PrismaService } from '../../infra/prisma/prisma.service'
import { UsersService } from '../users/users.service'

import { LoginRequest } from './dto/login.dto'
import { RegisterRequest } from './dto/register.dto'
import { EmailConfirmationService } from './email-confirmation/email-confirmation.service'
import { ProviderService } from './provider/provider.service'
import { TwoFactorAuthService } from './two-factor-auth/two-factor-auth.service'

@Injectable()
export class AuthService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService,
		private readonly userService: UsersService,
		private readonly providerService: ProviderService,
		private readonly emailConfirmationService: EmailConfirmationService,
		private readonly twoFactorAuthService: TwoFactorAuthService
	) {}

	async register(dto: RegisterRequest) {
		const { name, email, password } = dto
		const isExists = await this.userService.findByEmail(email)
		if (isExists)
			throw new ConflictException(
				'Регистрация не удалась. Пользователь с таким email уже существует. Пожалуйста, используйте другое email или войдите в систему.'
			)

		const newUser = await this.userService.create(
			email,
			password,
			name,
			AuthMethod.CREDENTIALS,
			false
		)

		await this.emailConfirmationService.sendVerificationToken(newUser.email)

		return {
			message:
				'Вы успешно зарегистрировались. Пожалуйста, подтвердите ваш email. Сообщение было отправлено на ваш почтовый адрес.'
		}
	}

	async login(req: Request, dto: LoginRequest) {
		const { email, password } = dto

		const user = await this.userService.findByEmail(email)
		if (!user || !user.password)
			throw new NotFoundException(
				'Пользователь не найден. Пожалуйста, проверьте введененные данные'
			)
		const isValidPassword = await verify(user.password, password)
		if (!isValidPassword)
			throw new NotFoundException(
				'Неверный пароль. Пожалуйста, попробуйте еще раз или восстановите пароль, если забыли его.'
			)

		if (!user.isVerified) {
			await this.emailConfirmationService.sendVerificationToken(
				user.email
			)
			throw new UnauthorizedException(
				'Ваш email не подтвержден. Пожалуйста, проверьте вашу почту и подтвердите адрес.'
			)
		}

		if (user.isTwoFactorEnabled) {
			if (!dto.code) {
				await this.twoFactorAuthService.sendTwoFactorToken(user.email)
				return {
					message:
						'Проверьте вашу почту. Требуется код двухфакторной аутентификации.'
				}
			}

			await this.twoFactorAuthService.validateTwoFactorToken(
				user.email,
				dto.code
			)
		}

		return this.saveSession(req, user)
	}

	async extractProfileFromCode(req: Request, provider: string, code: string) {
		const providerInstance = this.providerService.findByService(provider)
		const profile = await providerInstance.findUserByCode(code)

		const account = await this.prismaService.account.findFirst({
			where: {
				id: profile.id,
				provider: profile.provider
			},
			include: {
				user: true
			}
		})

		if (account && account.user) return this.saveSession(req, account.user)

		let user = await this.userService.findByEmail(profile.email)

		if (!user) {
			user = await this.userService.create(
				profile.email,
				'',
				profile.name,
				AuthMethod[profile.provider.toUpperCase()],
				true,
				profile.picture
			)
		}

		await this.prismaService.account.create({
			data: {
				userId: user.id,
				type: 'oauth',
				provider: profile.provider,
				accessToken: profile.access_token,
				refreshToken: profile.refresh_token,
				expiresAt: profile.expires_at
			}
		})

		return this.saveSession(req, user)
	}

	async logout(req: Request, res: Response): Promise<void> {
		return new Promise((resolve, reject) => {
			req.session.destroy(err => {
				if (err)
					return reject(
						new InternalServerErrorException(
							`Не удалось завершить сессию. Возможно, возникла проблема с сервером или сессия уже была завершена`
						)
					)
				res.clearCookie(
					this.configService.getOrThrow<string>('SESSION_NAME'),
					{
						domain: this.configService.getOrThrow<string>(
							'SESSION_DOMAIN'
						),
						path: '/',
						maxAge: ms(
							this.configService.getOrThrow<StringValue>(
								'SESSION_MAX_AGE'
							)
						),
						httpOnly: parseBoolean(
							this.configService.getOrThrow<string>(
								'SESSION_HTTP_ONLY'
							)
						),
						secure: parseBoolean(
							this.configService.getOrThrow<string>(
								'SESSION_SECURE'
							)
						),
						sameSite: 'none'
					}
				)
				resolve()
			})
		})
	}

	async saveSession(req: Request, user: User) {
		return new Promise((resolve, reject) => {
			req.session.userId = user.id

			req.session.save(err => {
				if (err) {
					return reject(
						new InternalServerErrorException(
							`Не удалось сохранить сессию. Проверьте, правильно ли настроены параметры сессии.`
						)
					)
				}
				resolve({
					user
				})
			})
		})
	}
}
