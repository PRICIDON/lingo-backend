import { ApiProperty } from '@nestjs/swagger'

export class GetCourseResponse {
	@ApiProperty({
		description: 'Course Id',
		example: 'course-id'
	})
	id: string
	@ApiProperty({
		description: 'Course Title',
		example: 'Japan'
	})
	title: string
	@ApiProperty({
		description: 'Course Image Source',
		example: '/jp.svg'
	})
	imageSrc: string
}
