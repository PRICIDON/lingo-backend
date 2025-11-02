import { Injectable } from '@nestjs/common'

import { PrismaService } from '../../infra/prisma/prisma.service'

import {
	CreateChallengeOptionRequest,
	UpdateChallengeOptionRequest
} from './dto/challenge-option.dto'

@Injectable()
export class ChallengeOptionsService {
	constructor(private readonly prismaService: PrismaService) {}

	async getChallengeOptions() {
		const items = await this.prismaService.challengeOption.findMany()
		const count = await this.prismaService.challengeOption.count()

		return { items, count }
	}
	async getChallengeOptionById(challengeOptionId: string) {
		const data = await this.prismaService.challengeOption.findFirst({
			where: {
				id: challengeOptionId
			}
		})
		return data
	}
	async createChallengeOption(body: CreateChallengeOptionRequest) {
		const data = await this.prismaService.challengeOption.create({
			data: {
				...body
			}
		})
		return data
	}
	async updateChallengeOption(
		challengeOptionId: string,
		body: UpdateChallengeOptionRequest
	) {
		const data = await this.prismaService.challengeOption.update({
			where: {
				id: challengeOptionId
			},
			data: {
				...body
			}
		})
		return data
	}
	async deleteChallengeOption(challengeOptionId: string) {
		const data = await this.prismaService.challengeOption.delete({
			where: {
				id: challengeOptionId
			}
		})
		return data
	}
}
