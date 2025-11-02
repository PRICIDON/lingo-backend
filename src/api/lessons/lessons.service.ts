import { Injectable } from '@nestjs/common'

import { PrismaService } from '../../infra/prisma/prisma.service'
import { CoursesService } from '../courses/courses.service'

import { CreateLessonRequest, UpdateLessonRequest } from './dto/lesson.dto'

@Injectable()
export class LessonsService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly courseService: CoursesService
	) {}

	async getLesson(userId: string) {
		const userProgress = await this.courseService.getCourseProgress(userId)
		if (!userProgress?.activeLessonId) return null

		const lesson = await this.prismaService.lesson.findFirst({
			where: {
				id: userProgress.activeLessonId
			},
			select: {
				id: true,
				title: true,
				order: true,
				challenges: {
					orderBy: {
						order: 'asc'
					},
					select: {
						id: true,
						question: true,
						order: true,
						type: true,
						challengeOptions: {
							select: {
								id: true,
								text: true,
								correct: true,
								imageSrc: true,
								audioSrc: true
							}
						},
						challengeProgress: {
							where: {
								userId
							},
							select: {
								id: true,
								completed: true
							}
						}
					}
				}
			}
		})
		if (!lesson || !lesson.challenges) return null

		const normalizedChallenges = lesson.challenges.map(challenge => {
			const completed =
				challenge.challengeProgress &&
				challenge.challengeProgress.length > 0 &&
				challenge.challengeProgress.every(
					progress => progress.completed
				)
			return { ...challenge, completed }
		})
		return { ...lesson, challenges: normalizedChallenges }
	}

	async getPracticeLesson(userId: string, lessonId: string) {
		const lesson = await this.prismaService.lesson.findFirst({
			where: {
				id: lessonId
			},
			select: {
				id: true,
				title: true,
				order: true,
				challenges: {
					orderBy: {
						order: 'asc'
					},
					select: {
						id: true,
						question: true,
						order: true,
						type: true,
						challengeOptions: {
							select: {
								id: true,
								text: true,
								correct: true,
								imageSrc: true,
								audioSrc: true
							}
						},
						challengeProgress: {
							where: {
								userId
							},
							select: {
								id: true,
								completed: true
							}
						}
					}
				}
			}
		})
		if (!lesson || !lesson.challenges) return null

		const normalizedChallenges = lesson.challenges.map(challenge => {
			const completed =
				challenge.challengeProgress &&
				challenge.challengeProgress.length > 0 &&
				challenge.challengeProgress.every(
					progress => progress.completed
				)
			return { ...challenge, completed }
		})
		return { ...lesson, challenges: normalizedChallenges }
	}

	async getLessonPercentage(userId: string) {
		const lesson = await this.getLesson(userId)
		if (!lesson) return null
		const completedChallenges = lesson.challenges.filter(
			challenge => challenge.completed
		)
		const percentage = Math.round(
			(completedChallenges.length / lesson.challenges.length) * 100
		)

		return percentage
	}

	async getLessons() {
		const items = await this.prismaService.lesson.findMany()
		const count = await this.prismaService.lesson.count()

		return { items, count }
	}

	async getLessonById(lessonId: string) {
		const data = await this.prismaService.lesson.findFirst({
			where: {
				id: lessonId
			}
		})

		return data
	}

	async createLesson(body: CreateLessonRequest) {
		const data = await this.prismaService.lesson.create({
			data: {
				...body
			}
		})
		return data
	}

	async updateLesson(lessonId: string, body: UpdateLessonRequest) {
		const data = await this.prismaService.lesson.update({
			where: {
				id: lessonId
			},
			data: {
				...body
			}
		})
		return data
	}

	async deleteLesson(lessonId: string) {
		const data = await this.prismaService.lesson.delete({
			where: {
				id: lessonId
			}
		})
		return data
	}
}
