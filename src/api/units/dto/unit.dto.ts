import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateUnitRequest {
	@ApiProperty({
		description: 'Unit Title',
		example: 'Unit 1'
	})
	@IsString()
	@IsNotEmpty()
	title: string
	@ApiProperty({
		description: 'Unit Description',
		example: 'Basics of Japan'
	})
	@IsString()
	@IsNotEmpty()
	description: string
	@ApiProperty({
		description: 'Unit Order',
		example: 1
	})
	@IsNumber()
	@IsNotEmpty()
	order: number
	@ApiProperty({
		description: 'Course Id',
		example: '81d41c14-1faf-42c2-a62d-7cbc5a348588'
	})
	@IsString()
	@IsNotEmpty()
	courseId: string
}

export class UpdateUnitRequest {
	@ApiProperty({
		description: 'Unit Title',
		example: 'Unit 1'
	})
	@IsString()
	@IsOptional()
	title: string

	@ApiProperty({
		description: 'Unit Description',
		example: 'Basics of Japan'
	})
	@IsString()
	@IsOptional()
	description: string

	@ApiProperty({
		description: 'Unit Order',
		example: 1
	})
	@IsNumber()
	@IsOptional()
	order: number

	@ApiProperty({
		description: 'Course Id',
		example: '81d41c14-1faf-42c2-a62d-7cbc5a348588'
	})
	@IsString()
	@IsOptional()
	courseId: string
}

export class UnitResponse {
	@ApiProperty({
		description: 'Unit ID',
		example: 'c3ba19dc-0732-48f2-8ef7-6a62159a4e52'
	})
	id: string

	@ApiProperty({
		description: 'Unit Title',
		example: 'Unit 1'
	})
	title: string

	@ApiProperty({
		description: 'Unit Description',
		example: 'Basics of Japan'
	})
	description: string

	@ApiProperty({
		description: 'Unit Order',
		example: 1
	})
	order: number

	@ApiProperty({
		description: 'Course Id',
		example: '81d41c14-1faf-42c2-a62d-7cbc5a348588'
	})
	courseId: string

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
