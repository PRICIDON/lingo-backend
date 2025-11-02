import { IsNotEmpty, IsString } from 'class-validator'

export class UpsertUserProgressRequest {
	@IsString()
	@IsNotEmpty()
	courseId: string
}
