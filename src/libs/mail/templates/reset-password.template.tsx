import * as React from 'react'
import { Body, Heading, Html, Link, Text } from '@react-email/components'

interface ResetPasswordTemplateProps {
	domain: string
	token: string
}

export default function ResetPasswordTemplate({ domain, token }: ResetPasswordTemplateProps) {
	const resetLink = `${domain}/auth/new-password?token=${token}`
	
	return (
		<Html>
			<Body>
				<Heading>
					Сброс пароля
				</Heading>
				<Text>
					Привет! Вы запросили сброс пароля. Пожалуйста, перейдите по следующей ссылке, чтобы создать новый пароль:
				</Text>
				<Link href={resetLink}>Подтвердить сброс пароля</Link>
				<Text>Эта ссылка действительна в течение 1 часа. Если вы не запрашивали подтверждение, просто проигнорируйте это сообщение.</Text>
				<Text>Спасибо за использование нашего сервиса!</Text>
			</Body>
		</Html>
	)
}
