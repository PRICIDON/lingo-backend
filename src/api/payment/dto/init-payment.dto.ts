import { ApiProperty } from '@nestjs/swagger'
import { BillingPeriod, PaymentProvider } from '@prisma/client'
import { IsEnum, IsNotEmpty, IsString } from 'class-validator'

export class InitPaymentRequest {
	@ApiProperty({
		description: 'ID of the selected subscription plan',
		example: '783028a4-d16d-46ce-b3f0-d11af1984d1a'
	})
	@IsString()
	@IsNotEmpty()
	planId: string

	@ApiProperty({
		description: 'Subscription billing period (monthly or yearly)',
		example: BillingPeriod.MONTHLY,
		enum: BillingPeriod
	})
	@IsEnum(BillingPeriod)
	@IsNotEmpty()
	billingPeriod: BillingPeriod

	@ApiProperty({
		description: 'Payment provider',
		example: PaymentProvider.STRIPE,
		enum: PaymentProvider
	})
	@IsEnum(PaymentProvider)
	@IsNotEmpty()
	provider: PaymentProvider
}

export class InitPaymentResponse {
	@ApiProperty({
		description: 'URL to redirect the user to external payment provider',
		example: 'https://checkout.stripe.com/xyi'
	})
	url: string
}
