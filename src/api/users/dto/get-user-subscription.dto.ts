import { ApiProperty } from '@nestjs/swagger'
import { SubscriptionStatus } from '@prisma/client'

export class UserSubscriptionResponse {
	@ApiProperty({
		example: 'da273dfa-48df-4da8-ab59-09a9858edc35',
		description: 'Subscription ID'
	})
	id: string
	@ApiProperty({
		example: SubscriptionStatus.ACTIVE,
		description: 'Current subscription status',
		enum: SubscriptionStatus
	})
	status: SubscriptionStatus

	@ApiProperty({
		example: '2025-06-13T00:00:00.000Z',
		description: 'Subscription start date'
	})
	startDate: Date

	@ApiProperty({
		example: '2026-06-13T00:00:00.000Z',
		description: 'Subscription end date'
	})
	endDate: Date
	@ApiProperty({
		example: 'sub_1SNAGDEO67oE9OibpUxZxrjK',
		description: 'Stripe Subscription Id',
		required: false
	})
	stripeSubscriptionId: string
	@ApiProperty({
		example: 'da273dfa-48df-4da8-ab59-09a9858edc35',
		description: 'Plan ID'
	})
	planId: string
	@ApiProperty({
		example: 'da273dfa-48df-4da8-ab59-09a9858edc35',
		description: 'User ID'
	})
	userId: string
	
	@ApiProperty({
		example: true,
		description: 'Subscription Active Status'
	})
	isActive: boolean
}
