import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import {
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse
} from '@nestjs/swagger'

import { Authorized } from '../../common/decorators/authorized.decorator'
import { Protected } from '../../common/decorators/protected.decorator'

import { CoursesService } from './courses.service'
import {
	CourseResponse,
	CreateCourseRequest,
	UpdateCourseRequest
} from './dto/course.dto'
import { GetCourseProgressResponse } from './dto/get-course-progress.dto'
import { UpsertUserProgressRequest } from './dto/upsert-user-progress.dto'

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
	constructor(private readonly coursesService: CoursesService) {}

	@ApiOperation({
		summary: 'Get courses'
	})
	@ApiOkResponse({
		type: [CourseResponse]
	})
	@Get()
	async getCourses() {
		return await this.coursesService.getCourses()
	}

	@ApiOperation({
		summary: 'Get course progress'
	})
	@ApiOkResponse({
		type: GetCourseProgressResponse
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized'
	})
	@Protected()
	@Get('progress')
	async getCourseProgress(@Authorized('id') id: string) {
		return await this.coursesService.getCourseProgress(id)
	}

	@Protected()
	@Put('upsert-user-progress')
	async upsertUserProgress(
		@Authorized('id') userId: string,
		@Body() dto: UpsertUserProgressRequest
	) {
		return await this.coursesService.upsertUserProgress(
			userId,
			dto.courseId
		)
	}

	@ApiOperation({
		summary: 'Create course'
	})
	@ApiOkResponse({
		type: CourseResponse
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized'
	})
	@Protected()
	@Post()
	async createCourse(@Body() dto: CreateCourseRequest) {
		return await this.coursesService.createCourse(dto)
	}

	@ApiOperation({
		summary: 'Get course by Id'
	})
	@ApiOkResponse({
		type: CourseResponse
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized'
	})
	@Protected()
	@Get(':courseId')
	async getCourseByIdAdmin(@Param('courseId') id: string) {
		return await this.coursesService.getCourseByIdAdmin(id)
	}

	@ApiOperation({
		summary: 'Update course by Id'
	})
	@ApiOkResponse({
		type: CourseResponse
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized'
	})
	@Protected()
	@Put(':courseId')
	async updateCourse(
		@Param('courseId') id: string,
		@Body() dto: UpdateCourseRequest
	) {
		return await this.coursesService.updateCourse(id, dto)
	}

	@ApiOperation({
		summary: 'Delete course by Id'
	})
	@ApiOkResponse({
		type: CourseResponse
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized'
	})
	@Protected()
	@Delete(':courseId')
	async deleteCourse(@Param('courseId') id: string) {
		return await this.coursesService.deleteCourse(id)
	}
}
