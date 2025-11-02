import { Injectable, NotFoundException } from '@nestjs/common'

import { PrismaService } from '../../infra/prisma/prisma.service'
import { UsersService } from '../users/users.service'

import {
	CreateChallengeRequest,
	UpdateChallengeRequest
} from './dto/challenge.dto'

@Injectable()
export class ChallengesService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly userService: UsersService
	) {}

	async getChallenges() {
		const items = await this.prismaService.challenge.findMany()
		const count = await this.prismaService.challenge.count()
		return { items, count }
	}

	async createChallenge(body: CreateChallengeRequest) {
		const data = await this.prismaService.challenge.create({
			data: {
				...body
			}
		})
		return data
	}

	async updateChallenge(challengeId: string, body: UpdateChallengeRequest) {
		const data = await this.prismaService.challenge.update({
			where: {
				id: challengeId
			},
			data: {
				...body
			}
		})
		return data
	}

	async deleteChallenge(challengeId: string) {
		const data = await this.prismaService.challenge.delete({
			where: {
				id: challengeId
			}
		})
		return data
	}

	async getChallengeById(challengeId: string) {
		const challenge = await this.prismaService.challenge.findFirst({
			where: {
				id: challengeId
			}
		})
		return challenge
	}

	async getChallengeProgress(userId: string, challengeId: string) {
		return this.prismaService.challengeProgress.findFirst({
			where: {
				userId,
				challengeId
			},
			select: {
				id: true,
				completed: true,
				challengeId: true,
				userId: true
			}
		})
	}

	async upsertChallengeProgress(userId: string, challengeId: string) {
		const currentUserProgress =
			await this.userService.getUserProgress(userId)

		if (!currentUserProgress)
			throw new NotFoundException('Прогресс пользователя не найден')

		const challenge = await this.getChallengeById(challengeId)

		if (!challenge) throw new NotFoundException('Челлендж не найден')

		const existingChallengeProgress = await this.getChallengeProgress(
			userId,
			challengeId
		)

		const isPractice = !!existingChallengeProgress

		if (
			currentUserProgress.hearts === 0 &&
			!isPractice
			// && !userSubscription?.isActive
		)
			return { error: 'hearts' }

		if (isPractice) {
			await this.prismaService.challengeProgress.update({
				where: {
					id: existingChallengeProgress.id
				},
				data: {
					completed: true
				}
			})
			return
		}
		await this.prismaService.challengeProgress.create({
			data: {
				challengeId,
				userId,
				completed: true
			}
		})
		await this.prismaService.userProgress.update({
			where: {
				userId
			},
			data: {
				points: currentUserProgress.points + 10
			}
		})
	}
}
