import { forwardRef, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha'

import { JwtStrategy } from '../../common/strategies/jwt.strategy'
import { getJwtConfig } from '../../config/jwt.config'
import { getProvidersConfig } from '../../config/providers.config'
import { getRecaptchaConfig } from '../../config/recaptcha.config'
import { UsersModule } from '../users/users.module'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { EmailConfirmationModule } from './email-confirmation/email-confirmation.module'
import { ProviderModule } from './provider/provider.module'
import { PasswordRecoveryModule } from './password-recovery/password-recovery.module';
import { TwoFactorAuthModule } from './two-factor-auth/two-factor-auth.module';

@Module({
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy],
	exports: [AuthService],
	imports: [
		PassportModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: getJwtConfig,
			inject: [ConfigService]
		}),
		UsersModule,
		GoogleRecaptchaModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getRecaptchaConfig,
			inject: [ConfigService]
		}),
		ProviderModule.registerAsync({
			imports: [ConfigModule],
			useFactory: getProvidersConfig,
			inject: [ConfigService]
		}),
		forwardRef(() => EmailConfirmationModule),
		PasswordRecoveryModule,
		TwoFactorAuthModule
	]
})
export class AuthModule {}
