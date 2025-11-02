import { IsNotEmpty, IsString } from 'class-validator'

export class ReduceHeartsRequest {
	@IsString()
	@IsNotEmpty()
	challengeId: string
}
