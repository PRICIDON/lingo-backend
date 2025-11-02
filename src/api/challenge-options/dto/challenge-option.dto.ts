import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateChallengeOptionRequest {
	@ApiProperty({
		description: 'Challenge Option Text'
	})
	@IsString()
	@IsNotEmpty()
	text: string
	@ApiProperty({
		description: 'Challenge Option Correct?'
	})
	@IsBoolean()
	@IsNotEmpty()
	correct: boolean
	@ApiProperty({
		description: 'Challenge Option Image Source'
	})
	@IsString()
	@IsNotEmpty()
	imageSrc: string
	@ApiProperty({
		description: 'Challenge Option Audio Source'
	})
	@IsString()
	@IsNotEmpty()
	audioSrc: string
	@ApiProperty({
		description: 'Challenge Id'
	})
	@IsString()
	@IsNotEmpty()
	challengeId: string
}

export class UpdateChallengeOptionRequest {
	@ApiProperty({
		description: 'Challenge Option Text'
	})
	@IsString()
	@IsOptional()
	text: string
	@ApiProperty({
		description: 'Challenge Option Correct?'
	})
	@IsBoolean()
	@IsOptional()
	correct: boolean
	@ApiProperty({
		description: 'Challenge Option Image Source'
	})
	@IsString()
	@IsOptional()
	imageSrc: string
	@ApiProperty({
		description: 'Challenge Option Audio Source'
	})
	@IsString()
	@IsOptional()
	audioSrc: string
	@ApiProperty({
		description: 'Challenge Id'
	})
	@IsString()
	@IsOptional()
	challengeId: string
}

export class ChallengeOptionResponse {
	@ApiProperty({
		description: 'Challenge Progress Id',
		example: '81d41c14-1faf-42c2-a62d-7cbc5a348588'
	})
	id: string

	@ApiProperty({
		description: 'Challenge Answer',
		example: 'el hombre'
	})
	text: string

	@ApiProperty({
		description: 'Challenge Option correct or not',
		example: true
	})
	correct: boolean

	@ApiProperty({
		description: 'Image Source',
		example: '/man.svg'
	})
	imageSrc: string

	@ApiProperty({
		description: 'Audio Source',
		example: '/es_man.mp3'
	})
	audioSrc: string

	@ApiProperty({
		description: 'Challenge Id'
	})
	challengeId: string
}
