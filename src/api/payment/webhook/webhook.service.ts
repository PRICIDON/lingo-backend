import { Injectable, UnauthorizedException } from '@nestjs/common'

import { PaymentHandler } from '../payment.handler'
import { CryptoService } from '../providers/crypto/crypto.service'
import { StripeService } from '../providers/stripe/stripe.service'
import { YoomoneyService } from '../providers/yoomoney/yoomoney.service'

import { CryptoWebhookDto } from './dto/crypto-webhook.dto'
import { YookassaWebhookDto } from './dto/yookassa-webhook.dto'

@Injectable()
export class WebhookService {
	constructor(
		private readonly paymentHandler: PaymentHandler,
		private readonly stripeService: StripeService,
		private readonly cryptoService: CryptoService,
		private readonly yoomoneyService: YoomoneyService
	) {}

	async handleYookassa(dto: YookassaWebhookDto, ip: string) {
		this.yoomoneyService.verifyWebhook(ip)

		console.log('YOOKASSA WEBHOOK: ', dto)

		const result = await this.yoomoneyService.handleWebhook(dto)

		return await this.paymentHandler.processResult(result)
	}

	async handleStripe(rawBod: Buffer, sig: string) {
		const event = await this.stripeService.parseEvent(rawBod, sig)

		const result = await this.stripeService.handleWebhook(event)

		if (!result) return { ok: true }

		return await this.paymentHandler.processResult(result)
	}

	async handleCrypto(rawBody: Buffer, sig: string) {
		this.cryptoService.verifyWebhook(rawBody, sig)

		const body: CryptoWebhookDto = JSON.parse(rawBody.toString())
		if (!this.cryptoService.isFreshRequest(body))
			throw new UnauthorizedException('Request too old')

		const result = await this.cryptoService.handleWebhook(body)

		return await this.paymentHandler.processResult(result)
	}
}
