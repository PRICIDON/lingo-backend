import { HttpService } from '@nestjs/axios'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Plan, Transaction, TransactionStatus } from '@prisma/client'
import { createHash, createHmac } from 'crypto'
import { firstValueFrom } from 'rxjs'

import { CRYPTOPAY_API_URL } from '../../constants/payment.constant'
import { PaymentWebhookResult } from '../../interfaces/payment-webhook.interface'
import { CryptoWebhookDto } from '../../webhook/dto/crypto-webhook.dto'

import { CryptoResponse, FiatCurrency } from './interfaces/common.interface'
import {
	CreateInvoiceRequest,
	Currency,
	InvoiceStatus,
	PaidButtonName
} from './interfaces/create-invoice.interface'

@Injectable()
export class CryptoService {
	private readonly TOKEN: string
	private readonly APP_URL: string

	constructor(
		private readonly configService: ConfigService,
		private readonly httpService: HttpService
	) {
		this.APP_URL = configService.getOrThrow<string>('APP_URL')

		this.TOKEN = this.configService.getOrThrow<string>('CRYPTO_PAY_TOKEN')
	}
	async create(plan: Plan, transaction: Transaction) {
		const successUrl = `${this.APP_URL}/payment/${transaction.id}/success`
		const payload: CreateInvoiceRequest = {
			amount: transaction.amount,
			currency_type: Currency.FIAT,
			fiat: FiatCurrency.RUB,
			description: `Оплата подписки на тарифный план: ${plan.title}`,
			hidden_message: 'Спасибо за оплату! Подписка активирована',
			paid_btn_name: PaidButtonName.CALLBACK,
			paid_btn_url: successUrl,
			payload: Buffer.from(
				JSON.stringify({
					transactionId: transaction.id,
					planId: plan.id
				})
			).toString('base64url')
		}
		const response = await this.makeRequest(
			'POST',
			'/createInvoice',
			payload
		)
		return response.result
	}

	async handleWebhook(dto: CryptoWebhookDto): Promise<PaymentWebhookResult> {
		const payload = JSON.parse(
			Buffer.from(dto.payload.payload ?? '', 'base64url').toString(
				'utf-8'
			)
		)

		const transactionId = payload?.transactionId
		const planId = payload?.planId
		const paymentId = dto.payload.invoice_id.toString()

		let status: TransactionStatus = TransactionStatus.PENDING

		switch (dto.payload.status) {
			case InvoiceStatus.PAID:
				status = TransactionStatus.SUCCEEDED
				break
			case InvoiceStatus.EXPIRED:
				status = TransactionStatus.FAILED
				break
		}

		return {
			paymentId,
			planId,
			transactionId,
			status,
			raw: dto
		}
	}

	isFreshRequest(body: any, maxAgeSecond: number = 300) {
		const requestDate = new Date(body.request_date).getTime()
		const now = Date.now()
		return now - requestDate <= maxAgeSecond * 1000
	}

	verifyWebhook(rawBody: Buffer, sig: string) {
		const secret = createHash('sha256').update(this.TOKEN).digest()

		const hmac = createHmac('sha256', secret).update(rawBody).digest('hex')

		if (hmac !== sig) throw new UnauthorizedException('Invalid signature')
	}

	private async makeRequest<T>(
		method: 'GET' | 'POST',
		endpoint: string,
		data?: any
	) {
		const headers = {
			'Crypto-Pay-API-Token': this.TOKEN
		}
		const observable = this.httpService.request<CryptoResponse<T>>({
			baseURL: CRYPTOPAY_API_URL,
			url: endpoint,
			method,
			data,
			headers
		})
		const { data: response } = await firstValueFrom(observable)
		return response
	}
}
