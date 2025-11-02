import { Injectable, NotFoundException } from '@nestjs/common'

import { PrismaService } from '../../infra/prisma/prisma.service'
import { UsersService } from '../users/users.service'

import { CreateCourseRequest, UpdateCourseRequest } from './dto/course.dto'

@Injectable()
export class CoursesService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly userService: UsersService
	) {}

	async getCourses() {
		const items = await this.prismaService.course.findMany()
		const count = await this.prismaService.course.count()
		return { items, count }
	}

	async getCourseById(courseId: string) {
		const course = await this.prismaService.course.findUnique({
			where: { id: courseId },
			include: {
				units: {
					orderBy: {
						order: 'asc'
					},
					include: {
						lessons: {
							orderBy: {
								order: 'asc'
							}
						}
					}
				}
			}
		})
		return course
	}

	async getCourseProgress(userId: string) {
		const userProgress = await this.userService.getUserProgress(userId)
		if (!userProgress?.activeCourseId) return null

		const unitsInActiveCourse = await this.prismaService.unit.findMany({
			where: {
				courseId: userProgress?.activeCourseId
			},
			orderBy: {
				order: 'asc'
			},
			select: {
				id: true,
				title: true,
				description: true,
				order: true,
				courseId: true,
				lessons: {
					orderBy: {
						order: 'asc'
					},
					select: {
						id: true,
						title: true,
						order: true,
						unitId: true,
						challenges: {
							select: {
								id: true,
								question: true,
								order: true,
								type: true,
								lessonId: true,
								challengeProgress: {
									select: {
										id: true,
										completed: true,
										challengeId: true,
										userId: true
									}
								}
							}
						}
					}
				}
			}
		})
		const firstUncompletedLesson = unitsInActiveCourse
			.flatMap(unit => unit.lessons)
			.find(lesson =>
				lesson.challenges.some(
					challenge =>
						challenge.challengeProgress?.some(
							progress => !progress.completed
						) || !challenge.challengeProgress?.length
				)
			)
		return {
			activeLesson: firstUncompletedLesson,
			activeLessonId: firstUncompletedLesson?.id
		}
	}
	async upsertUserProgress(userId: string, courseId: string) {
		const course = await this.getCourseById(courseId)
		if (!course) return new NotFoundException('Курс не найден')
		if (!course.units.length || !course.units[0].lessons.length)
			return new NotFoundException('Курс пустой(')

		const existingUserProgress =
			await this.userService.getUserProgress(userId)

		if (existingUserProgress) {
			await this.prismaService.userProgress.update({
				where: {
					userId
				},
				data: {
					activeCourseId: courseId
				}
			})
			return
		}
		await this.prismaService.userProgress.create({
			data: {
				userId,
				activeCourseId: courseId
			}
		})
	}

	async getCourseByIdAdmin(courseId: string) {
		const data = await this.prismaService.course.findFirst({
			where: {
				id: courseId
			}
		})

		return data
	}

	async createCourse(body: CreateCourseRequest) {
		const data = await this.prismaService.course.create({
			data: {
				...body
			}
		})

		return data
	}

	async updateCourse(courseId: string, body: UpdateCourseRequest) {
		const data = await this.prismaService.course.update({
			where: {
				id: courseId
			},
			data: {
				...body
			}
		})
		return data
	}

	async deleteCourse(courseId: string) {
		const data = await this.prismaService.course.delete({
			where: {
				id: courseId
			}
		})
		return data
	}
}
