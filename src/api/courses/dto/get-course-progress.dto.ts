import { ApiProperty } from '@nestjs/swagger'

import { GetLessonResponse } from '../../lessons/dto/get-lesson.dto'

export class GetCourseProgressResponse {
	@ApiProperty({
		description: 'Active Lesson',
		type: GetLessonResponse
	})
	activeLesson: GetLessonResponse
	@ApiProperty({
		description: 'Active Lesson Id',
		example: '3592814a-c440-418d-9479-08f52840c915'
	})
	activeLessonId: string
}
