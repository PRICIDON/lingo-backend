import { type ISendMailOptions, MailerService } from '@nestjs-modules/mailer'
import { InjectQueue } from '@nestjs/bullmq'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { Transaction, User } from '@prisma/client'
import { render } from '@react-email/components'
import { Queue } from 'bullmq'
import ConfirmationTemplate from 'src/libs/mail/templates/confirmation.template'

import PaymentFailedTemplate from './templates/payment-failed.template'
import PaymentSuccessTemplate from './templates/payment-success.template'
import ResetPasswordTemplate from './templates/reset-password.template'
import { SubscriptionExpiredTemplate } from './templates/subscription-expired.template'
import TwoFactorAuthTemplate from './templates/two-factor-auth.template'

@Injectable()
export class MailService {
	private readonly logger = new Logger(MailService.name)
	private readonly APP_URL: string

	constructor(
		private readonly mailerService: MailerService,
		@InjectQueue('mail') private readonly queue: Queue,
		private readonly configService: ConfigService
	) {
		this.APP_URL = configService.getOrThrow<string>('APP_URL')
	}

	async sendPaymentSuccessEmail(user: User, transaction: Transaction) {
		const html = await render(PaymentSuccessTemplate({ transaction }))

		await this.queue.add(
			'send email',
			{
				email: user.email,
				subject: 'Платеж успешно обработан',
				html
			},
			{ removeOnComplete: true }
		)
	}
	async sendPaymentFailedEmail(user: User, transaction: Transaction) {
		const html = await render(PaymentFailedTemplate({ transaction }))

		await this.queue.add(
			'send email',
			{
				email: user.email,
				subject: 'Проблема с обработкой платежа',
				html
			},
			{ removeOnComplete: true }
		)
	}

	async sendSubscriptionExpiredEmail(user: User) {
		const accountUrl = `${this.APP_URL}/dashboard`
		const html = await render(SubscriptionExpiredTemplate({ accountUrl }))

		await this.queue.add(
			'send email',
			{
				email: user.email,
				subject: 'Ваша подписка истекла',
				html
			},
			{ removeOnComplete: true }
		)
	}

	async sendConfirmationEmail(email: string, token: string) {
		const domain = this.configService.getOrThrow<string>('APP_URL')
		const html = await render(ConfirmationTemplate({ domain, token }))

		await this.queue.add(
			'send email',
			{
				email,
				subject: 'Подтверждение почты',
				html
			},
			{ removeOnComplete: true }
		)
	}

	async sendResetPasswordEmail(email: string, token: string) {
		const domain = this.configService.getOrThrow<string>('APP_URL')
		const html = await render(ResetPasswordTemplate({ domain, token }))

		await this.queue.add(
			'send email',
			{
				email,
				subject: 'Сброс пароля',
				html
			},
			{ removeOnComplete: true }
		)
	}

	async sendTwoFactorTokenEmail(email: string, token: string) {
		const html = await render(TwoFactorAuthTemplate({ token }))

		await this.queue.add(
			'send email',
			{
				email,
				subject: 'Подтверждение вашей личности',
				html
			},
			{ removeOnComplete: true }
		)
	}

	async sendMail(options: ISendMailOptions) {
		try {
			await this.mailerService.sendMail(options)
		} catch (e) {
			this.logger.error(`Failed to sending email: `, e)
			throw e
		}
	}
}
