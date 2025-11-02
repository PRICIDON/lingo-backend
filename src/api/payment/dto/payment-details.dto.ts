import { ApiProperty } from '@nestjs/swagger'
import { BillingPeriod } from '@prisma/client'

class PlanInfo {
	@ApiProperty({
		description: 'Plan ID'
	})
	id: string
	@ApiProperty({
		description: 'Plan Title',
		example: 'Premium'
	})
	title: string
	@ApiProperty({
		description: 'Monthly price',
		example: 699
	})
	monthlyPrice: number
	@ApiProperty({
		description: 'Yearly price',
		example: 7500
	})
	yearlyPrice: number
}

class SubscriptionInfo {
	@ApiProperty({
		description: 'Detailed information about the selected plan'
	})
	plan: PlanInfo
}

export class PaymentDetailsResponse {
	@ApiProperty({
		description: 'Transaction ID'
	})
	id: string
	@ApiProperty({
		description: 'Billing period selected for the subscription',
		example: BillingPeriod.MONTHLY,
		enum: BillingPeriod
	})
	billingPeriod: BillingPeriod
	@ApiProperty({
		description: 'Subscription information including selected plan details',
		type: SubscriptionInfo
	})
	subscription: SubscriptionInfo
}
