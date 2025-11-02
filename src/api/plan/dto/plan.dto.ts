import { ApiProperty } from '@nestjs/swagger'

export class PlanResponse {
	@ApiProperty({
		description: 'Plan Id',
		example: 'bd50b259-c6bb-4b97-b9ab-c95ba8d1b47b'
	})
	id: string
	@ApiProperty({
		description: 'Plan Title',
		example: 'Pro'
	})
	title: string
	@ApiProperty({
		description: 'Plan Description',
		example: 'Full access to all platform features'
	})
	description: string
	@ApiProperty({
		description: 'Plan Features',
		example: [
			'Unlimited access to content',
			'Priority support',
			'Advanced analytics'
		],
		isArray: true,
		type: String
	})
	features: string[]
	@ApiProperty({
		description: 'Plan Monthly Price',
		example: 999
	})
	monthlyPrice: number
	@ApiProperty({
		description: 'Plan Yearly Price',
		example: 9990
	})
	yearlyPrice: number
}
