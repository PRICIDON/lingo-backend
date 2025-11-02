import { IsNotEmpty, IsString } from 'class-validator'

export class UpdateChallengeProgressRequest {
	@IsString()
	@IsNotEmpty()
	challengeId: string
}
