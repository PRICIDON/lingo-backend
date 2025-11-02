import * as React from 'react'
import {
	Body, Container, Font,
	Head,
	Heading,
	Html,
	Preview, Tailwind,
	Text
} from '@react-email/components'

interface TwoFactorAuthTemplateProps {
	token: string
}

export default function TwoFactorAuthTemplate({ token }: TwoFactorAuthTemplateProps) {
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
				<Preview>Двухфакторная аутентификация</Preview>
				<Body className="bg-gray-50 font-sans text-gray-700">
					<Container className="max-w-2xl mx-auto bg-white rounded-md shadow-md">
						<div className="relative px-8 py-16 overflow-hidden">
							<div className="relative text-center">
								<Heading className="mb-2 text-2xl font-bold text-slate-900">
									Двухфакторная аутентификация
								</Heading>
								
								<Text className="text-slate-500 text-base">
									Ваш код двухфакторной аутентификации: <strong>{token}</strong>
								</Text>
								<Text className="text-slate-500 text-base">
									Пожалуйста, введите этот код в приложение для завершения процесса аутентификации.
								</Text>
							</div>
							
							<div className="mt-10 text-center">
								<Text className="text-sm text-slate-500">
									Если вы не запрашивали этот код, просто проигнорируйте это сообщение.
								</Text>
							</div>
						</div>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}
