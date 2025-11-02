import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Patch,
	Post
} from '@nestjs/common'
import {
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse
} from '@nestjs/swagger'

import { Authorized } from '../../common/decorators/authorized.decorator'
import { Protected } from '../../common/decorators/protected.decorator'

import { GetMeResponse } from './dto/get-me.dto'
import { GetUserProgressResponse } from './dto/get-user-progress.dto'
import { UserSubscriptionResponse } from './dto/get-user-subscription.dto'
import { ReduceHeartsRequest } from './dto/reduce-hearts.dto'
import {
	UpdateAutoRenewalRequest,
	UpdateAutoRenewalResponse
} from './dto/update-auto-renewal.dto'
import { UpdateUserRequest } from './dto/update-user.dto'
import { UsersService } from './users.service'

@ApiTags('Users')
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@ApiOperation({
		summary: 'Get current user profile',
		description:
			'Returns the currently authenticated user along with active subscription info'
	})
	@ApiOkResponse({
		type: GetMeResponse
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized'
	})
	@Protected()
	@HttpCode(HttpStatus.OK)
	@Get('@me')
	async getMe(@Authorized('id') id: string) {
		return await this.usersService.getMe(id)
	}

	@ApiOperation({
		summary: 'Get user progress'
	})
	@ApiOkResponse({
		type: GetUserProgressResponse
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized'
	})
	@Protected()
	@Get('progress')
	async getUserProgress(@Authorized('id') id: string) {
		return await this.usersService.getUserProgress(id)
	}

	@ApiOperation({
		summary: 'Get user progress'
	})
	@ApiOkResponse({
		type: UserSubscriptionResponse
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized'
	})
	@Protected()
	@Get('subscription')
	async getUserSubscription(@Authorized('id') id: string) {
		return await this.usersService.getUserSubscription(id)
	}

	@Protected()
	@Post('reduce-hearts')
	async reduceHearts(
		@Authorized('id') userId: string,
		@Body() dto: ReduceHeartsRequest
	) {
		return await this.usersService.reduceHearts(userId, dto.challengeId)
	}

	@Protected()
	@Post('refill-hearts')
	async refillHearts(@Authorized('id') userId: string) {
		return await this.usersService.refillHearts(userId)
	}

	@Get('top')
	async getTopTenUsers() {
		return await this.usersService.getTopTenUsers()
	}

	@ApiOperation({
		summary: 'Toggle auto-renewal setting',
		description:
			'Enables or disables subscription auto-renewal for the authenticated user'
	})
	@ApiOkResponse({
		type: UpdateAutoRenewalResponse
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized'
	})
	@Protected()
	@Patch('@me/auto-renewal')
	async updateAutoRenewal(
		@Authorized('id') userId: string,
		@Body() dto: UpdateAutoRenewalRequest
	) {
		return await this.usersService.updateAutoRenewal(userId, dto)
	}

	@Protected()
	@Patch('@me')
	async updateUser(
		@Authorized('id') userId: string,
		@Body() dto: UpdateUserRequest
	) {
		return await this.usersService.update(userId, dto)
	}
}
