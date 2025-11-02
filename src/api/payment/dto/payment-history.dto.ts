import { ApiProperty } from '@nestjs/swagger'
import { PaymentProvider, TransactionStatus } from '@prisma/client'

export class PaymentHistoryResponse {
	@ApiProperty({
		description: 'Transaction ID',
		example: '4429a29a-5906-48e6-90ee-ed075628f0d4'
	})
	id: string

	@ApiProperty({
		description: 'Transaction created at',
		example: '2025-10-24T08:17:42.865Z'
	})
	createdAt: Date

	@ApiProperty({
		description: 'Subscription plan name',
		example: 'Lingo Plus'
	})
	plan: string

	@ApiProperty({
		description: 'Amount of the transaction',
		example: 2499
	})
	amount: number

	@ApiProperty({
		description: 'Payment provider used for the transaction',
		example: PaymentProvider.STRIPE,
		enum: PaymentProvider
	})
	provider: PaymentProvider

	@ApiProperty({
		description: 'Transaction status',
		example: TransactionStatus.PENDING,
		enum: TransactionStatus
	})
	status: TransactionStatus
}
