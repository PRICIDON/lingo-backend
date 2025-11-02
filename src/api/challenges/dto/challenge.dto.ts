import { ApiProperty } from '@nestjs/swagger'
import { ChallengeType } from '@prisma/client'
import {
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString
} from 'class-validator'

import { ChallengeOptionResponse } from '../../challenge-options/dto/challenge-option.dto'

export class CreateChallengeRequest {
	@ApiProperty({
		description: 'Challenge Question',
		example: 'Which of these is "the man"?'
	})
	@IsString()
	@IsNotEmpty()
	question: string
	@ApiProperty({
		description: 'Challenge Order',
		example: 1
	})
	@IsNumber()
	@IsNotEmpty()
	order: number
	@ApiProperty({
		description: 'Type of Challenge',
		example: ChallengeType.ASSIST,
		enum: ChallengeType
	})
	@IsEnum(ChallengeType)
	@IsNotEmpty()
	type: ChallengeType
	@ApiProperty({
		description: 'Lesson Id',
		example: '81d41c14-1faf-42c2-a62d-7cbc5a348588'
	})
	@IsString()
	@IsNotEmpty()
	lessonId: string
}

export class UpdateChallengeRequest {
	@ApiProperty({
		description: 'Challenge Question',
		example: 'Which of these is "the man"?'
	})
	@IsString()
	@IsOptional()
	question: string
	@ApiProperty({
		description: 'Challenge Order',
		example: 1
	})
	@IsNumber()
	@IsOptional()
	order: number
	@ApiProperty({
		description: 'Type of Challenge',
		example: ChallengeType.ASSIST,
		enum: ChallengeType
	})
	@IsEnum(ChallengeType)
	@IsOptional()
	type: ChallengeType
	@ApiProperty({
		description: 'Lesson Id',
		example: '81d41c14-1faf-42c2-a62d-7cbc5a348588'
	})
	@IsString()
	@IsOptional()
	lessonId: string
}

export class ChallengeProgressResponse {
	@ApiProperty({
		description: 'Challenge Progress Id',
		example: '81d41c14-1faf-42c2-a62d-7cbc5a348588'
	})
	id: string

	@ApiProperty({
		description: 'Challenge Complete or Not?',
		example: '81d41c14-1faf-42c2-a62d-7cbc5a348588'
	})
	completed: boolean
	@ApiProperty({
		description: 'User Id',
		example: '81d41c14-1faf-42c2-a62d-7cbc5a348588'
	})
	userId: string
	@ApiProperty({
		description: 'Challenge Id',
		example: '81d41c14-1faf-42c2-a62d-7cbc5a348588'
	})
	challengeId: string
}

export class ChallengeResponse {
	@ApiProperty({
		description: 'Challenge Id',
		example: '81d41c14-1faf-42c2-a62d-7cbc5a348588'
	})
	id: string

	@ApiProperty({
		description: 'Challenge Question',
		example: 'Verbs'
	})
	question: string

	@ApiProperty({
		description: 'Challenge Order',
		example: 1
	})
	order: number

	@ApiProperty({
		description: 'Challenge Type (Select or Assist)',
		example: ChallengeType.SELECT,
		enum: ChallengeType
	})
	type: ChallengeType

	@ApiProperty({
		description: 'Lesson Id',
		example: '81d41c14-1faf-42c2-a62d-7cbc5a348588'
	})
	lessonId: string

	@ApiProperty({
		description: 'Challenge Progress',
		type: ChallengeProgressResponse,
		required: false
	})
	challengeProgress: ChallengeProgressResponse

	@ApiProperty({
		description: 'Challenge Options',
		type: [ChallengeOptionResponse],
		required: false
	})
	challengeOptions: ChallengeOptionResponse[]
	
	@ApiProperty({
		description: 'Completed',
		example: false,
	})
	completed: boolean
}
