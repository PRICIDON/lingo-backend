import {
	BadRequestException,
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Query,
	Req,
	Res,
	UseGuards
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Recaptcha } from '@nestlab/google-recaptcha'
import { Request, Response } from 'express'

import { AuthProviderGuard } from '../../common/guards/provider.guard'

import { AuthService } from './auth.service'
import { AuthResponse } from './dto/auth.dto'
import { LoginRequest } from './dto/login.dto'
import { RegisterRequest } from './dto/register.dto'
import { ProviderService } from './provider/provider.service'

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly configService: ConfigService,
		private readonly providerService: ProviderService
	) {}

	@ApiOperation({
		summary: 'Register a new user'
	})
	@ApiOkResponse({
		type: AuthResponse
	})
	@Recaptcha()
	@HttpCode(HttpStatus.OK)
	@Post('register')
	async register(@Body() dto: RegisterRequest) {
		return await this.authService.register(dto)
	}

	@ApiOperation({
		summary: 'Login an existing user'
	})
	@ApiOkResponse({
		type: AuthResponse
	})
	@Recaptcha()
	@Post('login')
	@HttpCode(HttpStatus.OK)
	async login(@Req() req: Request, @Body() dto: LoginRequest) {
		return await this.authService.login(req, dto)
	}

	@UseGuards(AuthProviderGuard)
	@Get('/oauth/callback/:provider')
	async callback(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
		@Query('code') code: string,
		@Param('provider') provider: string
	) {
		if (!code)
			throw new BadRequestException('Не был предоставлен код авторизации')
		await this.authService.extractProfileFromCode(req, provider, code)
		return res.redirect(
			`${this.configService.getOrThrow<string>('APP_URL')}/settings`
		)
	}

	@UseGuards(AuthProviderGuard)
	@Get('/oauth/connect/:provider')
	@HttpCode(HttpStatus.OK)
	async connect(@Param('provider') provider: string) {
		const providerInstance = this.providerService.findByService(provider)
		return {
			url: providerInstance.getAuthUrl()
		}
	}

	@ApiOperation({
		summary: 'Logout user'
	})
	@Post('logout')
	@HttpCode(HttpStatus.OK)
	async logout(
		@Res({ passthrough: true }) res: Response,
		@Req() req: Request
	) {
		return await this.authService.logout(req, res)
	}
}
