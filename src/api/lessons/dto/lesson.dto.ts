import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateLessonRequest {
	@ApiProperty({
		description: 'Lesson Title',
		example: 'Verbs'
	})
	@IsString()
	@IsNotEmpty()
	title: string
	@ApiProperty({
		description: 'Lesson Order',
		example: 1
	})
	@IsNumber()
	@IsNotEmpty()
	order: number
	@ApiProperty({
		description: 'Unit Id',
		example: '81d41c14-1faf-42c2-a62d-7cbc5a348588'
	})
	@IsString()
	@IsNotEmpty()
	unitId: string
}

export class UpdateLessonRequest {
	@ApiProperty({
		description: 'Lesson Title',
		example: 'Verbs'
	})
	@IsString()
	@IsOptional()
	title: string
	@ApiProperty({
		description: 'Lesson Order',
		example: 1
	})
	@IsNumber()
	@IsOptional()
	order: number
	@ApiProperty({
		description: 'Unit Id',
		example: '81d41c14-1faf-42c2-a62d-7cbc5a348588'
	})
	@IsString()
	@IsOptional()
	unitId: string
}

export class LessonResponse {
	@ApiProperty({
		description: 'Lesson Id',
		example: '81d41c14-1faf-42c2-a62d-7cbc5a348588'
	})
	id: string
	@ApiProperty({
		description: 'Lesson Title',
		example: 'Verbs'
	})
	title: string
	@ApiProperty({
		description: 'Lesson Order',
		example: 1
	})
	order: number
	@ApiProperty({
		description: 'Unit Id',
		example: '81d41c14-1faf-42c2-a62d-7cbc5a348588'
	})
	unitId: string
	@ApiProperty({
		description: 'Created At Unit',
		example: '2025-10-25T13:04:21.297Z'
	})
	createdAt: Date
	@ApiProperty({
		description: 'Updated At Unit',
		example: '2025-10-25T13:04:21.297Z'
	})
	updatedAt: Date
}
