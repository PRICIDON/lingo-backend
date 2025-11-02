import type { Plan } from '@prisma/client'

export const plans: Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>[] = [
	{
		title: 'Lingo Plus',
		description:
			'Это платная подписка, которая делает твой язык без рекламы, без страданий и с чуточкой суперсилы 💪🐸',
		features: ['Никакой рекламы', 'Бесконечные сердца'],
		monthlyPrice: 699,
		yearlyPrice: 7500,
		stripeMonthlyPriceId: 'price_1SMRsdEO67oE9Oibu65GFjZt',
		stripeYearlyPriceId: 'price_1SMRsdEO67oE9OibRD2jk5ve'
	}
]
