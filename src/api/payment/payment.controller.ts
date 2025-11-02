import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import {
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse
} from '@nestjs/swagger'
import { User } from '@prisma/client'

import { Authorized } from '../../common/decorators/authorized.decorator'
import { Protected } from '../../common/decorators/protected.decorator'

import { InitPaymentRequest, InitPaymentResponse } from './dto/init-payment.dto'
import { PaymentDetailsResponse } from './dto/payment-details.dto'
import { PaymentHistoryResponse } from './dto/payment-history.dto'
import { PaymentService } from './payment.service'

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
	constructor(private readonly paymentService: PaymentService) {}

	@ApiOperation({
		summary: 'Get payment history',
		description: 'Returns the list of all user transactions'
	})
	@ApiOkResponse({
		type: PaymentHistoryResponse
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized'
	})
	@Protected()
	@Get()
	async getHistory(@Authorized('id') userId: string) {
		return this.paymentService.getHistory(userId)
	}

	@ApiOperation({
		summary: 'Initiate a new payment',
		description:
			'Initializes a payment using the selected provider and billing period'
	})
	@ApiOkResponse({
		type: InitPaymentResponse
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized'
	})
	@Protected()
	@Post('init')
	async init(@Authorized() user: User, @Body() dto: InitPaymentRequest) {
		return this.paymentService.init(dto, user)
	}

	@ApiOperation({
		summary: 'Get transaction',
		description: 'Returns user transactions by ID'
	})
	@ApiOkResponse({
		type: PaymentDetailsResponse
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized'
	})
	@Get(':id')
	async getById(@Param('id') id: string) {
		return await this.paymentService.getById(id)
	}
}
