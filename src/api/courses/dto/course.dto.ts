import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateCourseRequest {
	@ApiProperty({
		description: 'Course Title',
		example: 'Verbs'
	})
	@IsString()
	@IsNotEmpty()
	title: string
	@ApiProperty({
		description: 'Image Source',
		example: '/jp.svg'
	})
	@IsString()
	@IsNotEmpty()
	imageSrc: string
}

export class UpdateCourseRequest {
	@ApiProperty({
		description: 'Course Title',
		example: 'Japan'
	})
	@IsString()
	@IsOptional()
	title: string

	@ApiProperty({
		description: 'Image Src',
		example: '/jp.svg'
	})
	@IsString()
	@IsOptional()
	imageSrc: string
}

export class CourseResponse {
	@ApiProperty({
		description: 'Course Id',
		example: '81d41c14-1faf-42c2-a62d-7cbc5a348588'
	})
	id: string
	@ApiProperty({
		description: 'Course Title',
		example: 'Japan'
	})
	title: string
	@ApiProperty({
		description: 'Image Source',
		example: '/jp.svg'
	})
	imageSrc: string

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
