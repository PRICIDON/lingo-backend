import { ApiProperty } from '@nestjs/swagger'

import { ChallengeResponse } from '../../challenges/dto/challenge.dto'

export class GetLessonResponse {
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
		description: 'Challenges in Lesson',
		type: [ChallengeResponse]
	})
	challenges: ChallengeResponse[]
	
	@ApiProperty({
		description: "Completed or Not",
		example: false
	})
	completed: boolean
}
