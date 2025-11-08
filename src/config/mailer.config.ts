import { type MailerOptions } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'
import * as FormData from 'form-data'

export function getMailerConfig(configService: ConfigService): MailerOptions {
	return {
		transport: {
			name: 'smtp.bz',
			version: '1.0.0',
			send: async (mail, callback) => {
				const data = mail.data
				const form = new FormData()

				form.append('name', 'Lingo')
				form.append('from', 'info@pricidon.ru')
				form.append(
					'to',
					typeof data.to === 'string' ? data.to : data.to[0]
				)
				form.append('subject', data.subject)
				form.append('html', data.html)
				try {
					const res = await axios.post(
						'https://api.smtp.bz/v1/smtp/send',
						form,
						{
							headers: {
								Authorization:
									configService.getOrThrow<string>(
										'MAIL_API_KEY'
									),
								...form.getHeaders()
							}
						}
					)

					callback(null, {
						envelope: mail.message.getEnvelope(),
						messageId: mail.message.messageId(),
						response: res.data
					})
				} catch (error) {
					callback(error)
				}
			}
		},
		defaults: {
			from: `"Lingo" <info@pricidon.ru>`
		}
	}
}
