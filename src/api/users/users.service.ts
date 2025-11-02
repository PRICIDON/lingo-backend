import {
	ConflictException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import {
	AuthMethod,
	PaymentProvider,
	SubscriptionStatus,
	TransactionStatus
} from '@prisma/client'
import { hash } from 'argon2'

import { PrismaService } from '../../infra/prisma/prisma.service'
import { StripeService } from '../payment/providers/stripe/stripe.service'

import { UpdateAutoRenewalRequest } from './dto/update-auto-renewal.dto'
import { UpdateUserRequest } from './dto/update-user.dto'

@Injectable()
export class UsersService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly stripeService: StripeService
	) {}

	async findById(id: string) {
		const user = await this.prismaService.user.findUnique({
			where: { id },
			include: { accounts: true }
		})
		if (!user)
			throw new NotFoundException(
				'Пользователь не найден. Пожалуйста, проверьте введенные данные'
			)
		return user
	}

	async findByEmail(email: string) {
		const user = await this.prismaService.user.findUnique({
			where: { email },
			include: { accounts: true }
		})

		return user
	}

	async create(
		email: string,
		password: string,
		name: string,
		method: AuthMethod,
		isVerified: boolean,
		imageSrc?: string
	) {
		const user = await this.prismaService.user.create({
			data: {
				email,
				password: password ? await hash(password) : '',
				name,
				imageSrc,
				method,
				isVerified
			},
			include: { accounts: true }
		})
		return user
	}

	async getMe(id: string) {
		const user = await this.prismaService.user.findUnique({
			where: { id },
			select: {
				id: true,
				email: true,
				name: true,
				role: true,
				imageSrc: true,
				isAutoRenewal: true,
				method: true,
				isVerified: true,
				isTwoFactorEnabled: true,
				subscription: {
					select: {
						status: true,
						startDate: true,
						endDate: true,
						plan: {
							select: {
								id: true,
								title: true,
								monthlyPrice: true,
								yearlyPrice: true
							}
						}
					}
				},
				accounts: true
			}
		})
		return user
	}

	async updateAutoRenewal(userId: string, dto: UpdateAutoRenewalRequest) {
		const { isAutoRenewal } = dto

		const subscription =
			await this.prismaService.userSubscription.findUnique({
				where: {
					userId
				},
				include: {
					transactions: {
						where: {
							status: TransactionStatus.SUCCEEDED
						},
						orderBy: {
							createdAt: 'desc'
						},
						take: 1
					}
				}
			})
		if (!subscription) throw new NotFoundException('Подписка не найдена')

		const lastTransaction = subscription.transactions[0]

		if (!lastTransaction)
			throw new NotFoundException(
				'У пользователя нету успешных транзакций'
			)

		if (
			lastTransaction.provider === PaymentProvider.STRIPE &&
			subscription.stripeSubscriptionId
		) {
			await this.stripeService.updateAutoRenewal(
				subscription.stripeSubscriptionId,
				isAutoRenewal
			)
		}

		await this.prismaService.user.update({
			where: {
				id: userId
			},
			data: {
				isAutoRenewal
			}
		})

		return { isAutoRenewal }
	}

	async getUserProgress(userId: string) {
		return this.prismaService.userProgress.findFirst({
			where: {
				userId
			},
			include: {
				activeCourse: {
					select: {
						id: true,
						title: true,
						imageSrc: true
					}
				},
				user: {
					select: {
						id: true,
						email: true,
						name: true,
						imageSrc: true
					}
				}
			}
		})
	}

	async getUserSubscription(userId: string) {
		const subscription =
			await this.prismaService.userSubscription.findUnique({
				where: {
					userId
				}
			})

		if (!subscription) return { isActive: false }

		const isActive = subscription.status === SubscriptionStatus.ACTIVE

		return {
			...subscription,
			isActive
		}
	}

	async reduceHearts(userId: string, challengeId: string) {
		const currentUserProgress = await this.getUserProgress(userId)
		const subscription = await this.getUserSubscription(userId)

		if (!currentUserProgress)
			throw new NotFoundException('Прогресс пользователя не найден')

		const existingChallengeProgress =
			await this.prismaService.challengeProgress.findFirst({
				where: {
					userId,
					challengeId
				}
			})
		const isPractice = !!existingChallengeProgress
		if (isPractice) return { error: 'practice' }

		if (currentUserProgress.hearts === 0) return { error: 'hearts' }

		if (subscription.isActive) return { error: 'subscription' }

		const challenge = await this.prismaService.challenge.findFirst({
			where: {
				id: challengeId
			}
		})
		if (!challenge) throw new NotFoundException('Челлендж не найден')

		await this.prismaService.userProgress.update({
			where: {
				userId
			},
			data: {
				hearts: Math.max(currentUserProgress.hearts - 1, 0)
			}
		})
	}

	async refillHearts(userId: string) {
		const POINTS_TO_REFILL = 50
		const currentUserProgress = await this.getUserProgress(userId)
		if (!currentUserProgress)
			throw new NotFoundException('Прогресс пользователя не найден')

		if (currentUserProgress.hearts === 5)
			throw new ConflictException('Сердца полны')
		if (currentUserProgress.points < POINTS_TO_REFILL)
			throw new ConflictException('Не хватает поинтов')

		await this.prismaService.userProgress.update({
			where: {
				userId: currentUserProgress.userId
			},
			data: {
				hearts: currentUserProgress.hearts + 1,
				points: currentUserProgress.points - POINTS_TO_REFILL
			}
		})
	}

	async getTopTenUsers() {
		const users = await this.prismaService.userProgress.findMany({
			orderBy: {
				points: 'desc'
			},
			take: 10,
			include: {
				user: {
					select: {
						id: true,
						name: true,
						imageSrc: true
					}
				}
			}
		})
		return users
	}

	async update(userId: string, dto: UpdateUserRequest) {
		const user = await this.findById(userId)

		const updatedUser = await this.prismaService.user.update({
			where: {
				id: user.id
			},
			data: {
				...dto
			}
		})
		return updatedUser
	}
}
