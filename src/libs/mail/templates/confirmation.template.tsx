import * as React from 'react'
import {
	Body, Container, Font,
	Head,
	Heading,
	Html,
	Link,
	Preview, Tailwind,
	Text
} from '@react-email/components'

interface ConfirmationTemplateProps {
	domain: string
	token: string
}

export default function ConfirmationTemplate({ domain, token }: ConfirmationTemplateProps) {
	const confirmLink = `${domain}/auth/new-verification?token=${token}`
	
	return (
		<Html>
			<Head>
				<Font
					fontFamily="Geist"
					fallbackFontFamily="Arial"
					webFont={{
						url: "https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap",
						format: 'woff2'
					}}
				/>
			</Head>
			<Tailwind>
				<Preview>Подтвердите вашу почту</Preview>
				<Body className="bg-gray-50 font-sans text-gray-700">
					<Container className="max-w-2xl mx-auto bg-white rounded-md shadow-md">
						<div className="relative px-8 py-16 overflow-hidden">
							<div className="relative text-center">
								<Heading className="mb-2 text-2xl font-bold text-slate-900">
									Здравствуйте, Присидон 👋
								</Heading>
								
								<Text className="text-slate-500 text-base">
									Спасибо за регистрацию! Нажмите на кнопку ниже, чтобы подтвердить вашу почту и завершить
									создание аккаунта.
								</Text>
								<Link
									href={confirmLink}
									className="inline-flex justify-center items-center rounded-xl text-sm font-medium text-white bg-[#18b9ae] px-5 py-2"
								>
									Подтвердить почту
								</Link>
							</div>
							
							<div className="mt-10 text-center">
								<Text className="text-sm text-slate-500">
									Эта ссылка действительна в течение 1 часа. Если вы не запрашивали подтверждение, просто проигнорируйте это сообщение.
								</Text>
							</div>
						</div>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}
