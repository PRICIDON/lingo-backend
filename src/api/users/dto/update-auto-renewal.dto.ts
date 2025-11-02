import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean } from 'class-validator'

export class UpdateAutoRenewalRequest {
	@ApiProperty({
		description: 'Enable or disable auto renewal',
		example: true
	})
	@IsBoolean()
	isAutoRenewal: boolean
}

export class UpdateAutoRenewalResponse {
	@ApiProperty({
		description: 'Enable or disable auto renewal',
		example: true
	})
	isAutoRenewal: boolean
}
