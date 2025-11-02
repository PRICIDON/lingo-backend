import { ApiProperty } from '@nestjs/swagger'

import { GetLessonResponse } from '../../lessons/dto/get-lesson.dto'

export class GetUnitsResponse {
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
		description: 'Lessons in Units',
		type: [GetLessonResponse],
		required: false
	})
	lessons: GetLessonResponse[]
}
