import { Injectable } from '@nestjs/common'

import { PrismaService } from '../../infra/prisma/prisma.service'
import { UsersService } from '../users/users.service'

import { CreateUnitRequest, UpdateUnitRequest } from './dto/unit.dto'

@Injectable()
export class UnitsService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly userService: UsersService
	) {}

	async getUnitsInActiveCourse(userId: string) {
		const userProgress = await this.userService.getUserProgress(userId)

		if (!userProgress?.activeCourseId) return []

		const data = await this.prismaService.unit.findMany({
			where: {
				courseId: userProgress.activeCourseId
			},
			orderBy: {
				order: 'asc'
			},
			// include: {
			// 	lessons: {
			// 		orderBy: {
			// 			order: 'asc'
			// 		},
			// 		include: {
			// 			challenges: {
			// 				orderBy: {
			// 					order: 'asc'
			// 				},
			// 				include: {
			// 					challengeProgress: true
			// 				}
			// 			}
			// 		}
			// 	}
			// }
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
							orderBy: {
								order: 'asc'
							},
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
		const normalizedData = data.map(unit => {
			const lessonsWithCompetedStatus = unit.lessons.map(lesson => {
				if (lesson.challenges.length === 0)
					return { ...lesson, completed: false }

				const allCompletedChallenges = lesson.challenges.every(
					challenge => {
						return (
							challenge.challengeProgress &&
							challenge.challengeProgress.length > 0 &&
							challenge.challengeProgress.every(
								progress => progress.completed
							)
						)
					}
				)
				return { ...lesson, completed: allCompletedChallenges }
			})
			return { ...unit, lessons: lessonsWithCompetedStatus }
		})
		return normalizedData
	}

	async getUnits() {
		const items = await this.prismaService.unit.findMany()
		const count = await this.prismaService.unit.count()
		return { items, count }
	}

	async getUnitById(unitId: string) {
		const data = await this.prismaService.unit.findFirst({
			where: {
				id: unitId
			}
		})
		return data
	}

	async createUnit(body: CreateUnitRequest) {
		const data = await this.prismaService.unit.create({
			data: {
				...body
			}
		})
		return data
	}

	async updateUnit(unitId: string, body: UpdateUnitRequest) {
		const data = await this.prismaService.unit.update({
			where: {
				id: unitId
			},
			data: {
				...body
			}
		})
		return data
	}

	async deleteUnit(unitId: string) {
		const data = await this.prismaService.unit.delete({
			where: {
				id: unitId
			}
		})
		return data
	}
}
