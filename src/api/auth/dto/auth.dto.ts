import { ApiProperty } from '@nestjs/swagger'

export class AuthResponse {
	@ApiProperty({
		description: 'Access token used for authorization',
		example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
	})
	accessToken: string
}
