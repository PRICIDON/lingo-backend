import { ApiProperty } from '@nestjs/swagger'

import { GetCourseResponse } from '../../courses/dto/get-course.dto'

import { GetMeResponse } from './get-me.dto'

export class GetUserProgressResponse {
	@ApiProperty({
		description: 'User Progress Id',
		example: 'user-progress-id'
	})
	id: string
	@ApiProperty({
		description: 'Hearts left',
		example: '5'
	})
	hearts: number
	@ApiProperty({
		description: 'Points in account',
		example: '100'
	})
	points: number
	@ApiProperty({
		description: 'User Id',
		example: 'user-id'
	})
	activeCourseId: string
	@ApiProperty({
		description: 'Course information',
		type: GetCourseResponse
	})
	activeCourse: GetCourseResponse
	@ApiProperty({
		description: 'Active Course Id',
		example: 'active-course-id'
	})
	userId: string
	@ApiProperty({
		description: 'User information',
		type: GetMeResponse
	})
	user: GetMeResponse
}
