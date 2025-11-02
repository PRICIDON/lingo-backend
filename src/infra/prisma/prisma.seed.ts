import { PrismaClient } from '@prisma/client'

import { plans } from './data/plans.data'

const prisma = new PrismaClient()

async function main() {
	try {
		console.log('Seeding database...')

		await prisma.plan.deleteMany()

		await prisma.plan.createMany({
			data: plans
		})

		const allCourses = await prisma.course.createManyAndReturn({
			data: [
				{
					title: 'Japan',
					imageSrc: '/jp.svg'
				},
				{
					title: 'French',
					imageSrc: '/fr.svg'
				}
			]
		})

		for (const course of allCourses) {
			const unit = await prisma.unit.create({
				data: {
					title: 'Unit 1',
					description: `Basics of ${course.title}`,
					order: 1,
					courseId: course.id
				}
			})

			const allLessons = await prisma.lesson.createManyAndReturn({
				data: [
					{
						unitId: unit.id, // Unit 1 (Learn the basics...)
						title: 'Nouns',
						order: 1
					},
					{
						unitId: unit.id, // Unit 1 (Learn the basics...)
						title: 'Verbs',
						order: 2
					}
				]
			})

			for (const lesson of allLessons) {
				const allChallenges =
					await prisma.challenge.createManyAndReturn({
						data: [
							{
								lessonId: lesson.id, // Nouns
								type: 'SELECT',
								order: 1,
								question: 'Which one of these is the "the man"?'
							},
							{
								lessonId: lesson.id, // Nouns
								type: 'ASSIST',
								order: 2,
								question: '"the man"'
							},
							{
								lessonId: lesson.id, // Nouns
								type: 'SELECT',
								order: 3,
								question:
									'Which one of these is the "the robot"?'
							}
						]
					})
				for (const challenge of allChallenges) {
					await prisma.challengeOption.createMany({
						data: [
							{
								challengeId: challenge.id,
								imageSrc: '/man.svg',
								correct: true,
								text: 'el hombre',
								audioSrc: '/es_man.mp3'
							},
							{
								challengeId: challenge.id,
								imageSrc: '/woman.svg',
								correct: false,
								text: 'la mujer',
								audioSrc: '/es_woman.mp3'
							},
							{
								challengeId: challenge.id,
								imageSrc: '/robot.svg',
								correct: false,
								text: 'el robot',
								audioSrc: '/es_robot.mp3'
							}
						]
					})
				}
			}
		}

		console.log('Seeding finished')
	} catch (e) {
		console.error(e)
		throw new Error('Failed to seed the database')
	}
}

main()
