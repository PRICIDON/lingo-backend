import { ConfigService } from '@nestjs/config'

import { TypeOptions } from '../api/auth/provider/provider.constants'
import { GoogleProvider } from '../api/auth/provider/services/google.provider'
import { YandexProvider } from '../api/auth/provider/services/yandex.provider'

export async function getProvidersConfig(
	configService: ConfigService
): Promise<TypeOptions> {
	return {
		baseUrl: configService.getOrThrow<string>('HTTP_HOST'),
		services: [
			new GoogleProvider({
				client_id: configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
				client_secret: configService.getOrThrow<string>(
					'GOOGLE_CLIENT_SECRET'
				),
				scopes: ['email', 'profile']
			}),
			new YandexProvider({
				client_id: configService.getOrThrow<string>('YANDEX_CLIENT_ID'),
				client_secret: configService.getOrThrow<string>(
					'YANDEX_CLIENT_SECRET'
				),
				scopes: ['login:email', 'login:avatar', 'login:info']
			})
		]
	}
}
