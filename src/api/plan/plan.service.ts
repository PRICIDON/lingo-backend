import { Injectable, NotFoundException } from '@nestjs/common'

import { PrismaService } from '../../infra/prisma/prisma.service'

@Injectable()
export class PlanService {
	constructor(private readonly prismaService: PrismaService) {}

	async getAll() {
		const plans = await this.prismaService.plan.findMany({
			orderBy: {
				monthlyPrice: 'asc'
			},
			select: {
				id: true,
				title: true,
				description: true,
				features: true,
				yearlyPrice: true,
				monthlyPrice: true
			}
		})
		return plans
	}
	async getPlanById(id: string) {
		const plan = await this.prismaService.plan.findUnique({
			where: {
				id
			},
			select: {
				id: true,
				title: true,
				description: true,
				features: true,
				yearlyPrice: true,
				monthlyPrice: true
			}
		})
		if (!plan) throw new NotFoundException('План не найден')
		return plan
	}
}
