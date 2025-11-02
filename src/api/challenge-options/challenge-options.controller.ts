import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import {
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse
} from '@nestjs/swagger'

import { Protected } from '../../common/decorators/protected.decorator'

import { ChallengeOptionsService } from './challenge-options.service'
import {
	ChallengeOptionResponse,
	CreateChallengeOptionRequest,
	UpdateChallengeOptionRequest
} from './dto/challenge-option.dto'

@ApiTags('Challenge Options')
@Controller('challengeOptions')
export class ChallengeOptionsController {
	constructor(
		private readonly challengeOptionsService: ChallengeOptionsService
	) {}
	@ApiOperation({
		summary: 'Get Challenge Options'
	})
	@ApiOkResponse({
		type: [ChallengeOptionResponse]
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized'
	})
	@Protected()
	@Get()
	async getChallengeOptions() {
		return await this.challengeOptionsService.getChallengeOptions()
	}
	@ApiOperation({
		summary: 'Create challenge option'
	})
	@ApiOkResponse({
		type: ChallengeOptionResponse
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized'
	})
	@Protected()
	@Post()
	async createChallengeOption(@Body() dto: CreateChallengeOptionRequest) {
		return await this.challengeOptionsService.createChallengeOption(dto)
	}
	@ApiOperation({
		summary: 'Get Challenge Option By Id'
	})
	@ApiOkResponse({
		type: ChallengeOptionResponse
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized'
	})
	@Protected()
	@Get(':challengeOptionId')
	async getChallengeOptionById(
		@Param('challengeOptionId') challengeOptionId: string
	) {
		return this.challengeOptionsService.getChallengeOptionById(
			challengeOptionId
		)
	}
	@ApiOperation({
		summary: 'Update Challenge By Id'
	})
	@ApiOkResponse({
		type: ChallengeOptionResponse
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized'
	})
	@Protected()
	@Put(':challengeOptionId')
	async updateChallengeOption(
		@Param('challengeOptionId') challengeOptionId: string,
		@Body() dto: UpdateChallengeOptionRequest
	) {
		return this.challengeOptionsService.updateChallengeOption(
			challengeOptionId,
			dto
		)
	}
	@ApiOperation({
		summary: 'Delete Challenge By Id'
	})
	@ApiOkResponse({
		type: ChallengeOptionResponse
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized'
	})
	@Protected()
	@Delete(':challengeOptionId')
	async deleteChallengeOption(
		@Param('challengeOptionId') challengeOptionId: string
	) {
		return this.challengeOptionsService.deleteChallengeOption(
			challengeOptionId
		)
	}
}
