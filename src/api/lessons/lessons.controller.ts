import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import {
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse
} from '@nestjs/swagger'

import { Authorized } from '../../common/decorators/authorized.decorator'
import { Protected } from '../../common/decorators/protected.decorator'

import { GetLessonResponse } from './dto/get-lesson.dto'
import {
	CreateLessonRequest,
	LessonResponse,
	UpdateLessonRequest
} from './dto/lesson.dto'
import { LessonsService } from './lessons.service'

@ApiTags('Lessons')
@Controller('lessons')
export class LessonsController {
	constructor(private readonly lessonsService: LessonsService) {}

	@ApiOperation({
		summary: 'Get lessons'
	})
	@ApiOkResponse({
		type: [LessonResponse]
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized'
	})
	@Protected()
	@Get()
	async getLessons() {
		return await this.lessonsService.getLessons()
	}

	@ApiOperation({
		summary: 'Get active lesson'
	})
	@ApiOkResponse({
		type: GetLessonResponse
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized'
	})
	@Protected()
	@Get('active')
	async getLesson(@Authorized('id') id: string) {
		return await this.lessonsService.getLesson(id)
	}

	@ApiOperation({
		summary: 'Get lesson percentage'
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized'
	})
	@Protected()
	@Get('percentage')
	async getLessonPercentage(@Authorized('id') id: string) {
		return await this.lessonsService.getLessonPercentage(id)
	}

	@ApiOperation({
		summary: 'Get practice lesson by id'
	})
	@ApiOkResponse({
		type: GetLessonResponse
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized'
	})
	@Protected()
	@Get('practice/:id')
	async getPracticeLesson(
		@Authorized('id') userId: string,
		@Param('id') lessonId: string
	) {
		return await this.lessonsService.getPracticeLesson(userId, lessonId)
	}

	@ApiOperation({
		summary: 'Get lesson by id'
	})
	@ApiOkResponse({
		type: LessonResponse
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized'
	})
	@Protected()
	@Get(':lessonId')
	async getLessonById(@Param('lessonId') lessonId: string) {
		return await this.lessonsService.getLessonById(lessonId)
	}

	@ApiOperation({
		summary: 'Create lesson'
	})
	@ApiOkResponse({
		type: LessonResponse
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized'
	})
	@Protected()
	@Post()
	async createLesson(@Body() dto: CreateLessonRequest) {
		return await this.lessonsService.createLesson(dto)
	}

	@ApiOperation({
		summary: 'Update lesson'
	})
	@ApiOkResponse({
		type: LessonResponse
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized'
	})
	@Protected()
	@Put(':lessonId')
	async updateLesson(
		@Param('lessonId') lessonId: string,
		@Body() dto: UpdateLessonRequest
	) {
		return await this.lessonsService.updateLesson(lessonId, dto)
	}

	@ApiOperation({
		summary: 'Delete lesson'
	})
	@ApiOkResponse({
		type: LessonResponse
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized'
	})
	@Protected()
	@Delete(':lessonId')
	async deleteLesson(@Param('lessonId') lessonId: string) {
		return await this.lessonsService.deleteLesson(lessonId)
	}
}
