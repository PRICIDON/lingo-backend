import { ConfigService } from '@nestjs/config'
import { GoogleRecaptchaModuleOptions } from '@nestlab/google-recaptcha'

import { isDev } from '../common/utils/is-dev.util'

export async function getRecaptchaConfig(
	configService: ConfigService
): Promise<GoogleRecaptchaModuleOptions> {
	return {
		secretKey: configService.getOrThrow<string>(
			'GOOGLE_RECAPTCHA_SECRET_KEY'
		),
		response: req => req.header.recaptcha,
		skipIf: isDev(configService)
	}
}
