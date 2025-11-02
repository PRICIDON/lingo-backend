import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import {
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse
} from '@nestjs/swagger'

import { Authorized } from '../../common/decorators/authorized.decorator'
import { Protected } from '../../common/decorators/protected.decorator'

import { ChallengesService } from './challenges.service'
import {
	ChallengeResponse,
	CreateChallengeRequest,
	UpdateChallengeRequest
} from './dto/challenge.dto'
import { UpdateChallengeProgressRequest } from './dto/upsert-challenge-progress.dto'

@ApiTags('Challenges')
@Controller('challenges')
export class ChallengesController {
	constructor(private readonly challengesService: ChallengesService) {}

	@ApiOperation({
		summary: 'Get Challenges'
	})
	@ApiOkResponse({
		type: [ChallengeResponse]
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized'
	})
	@Protected()
	@Get()
	async getChallenges() {
		return await this.challengesService.getChallenges()
	}

	@ApiOperation({
		summary: 'Upsert Challenge Progress'
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized'
	})
	@Protected()
	@Put('upsert-challenge-progress')
	async upsertChallengeProgress(
		@Authorized('id') userId: string,
		@Body() dto: UpdateChallengeProgressRequest
	) {
		return await this.challengesService.upsertChallengeProgress(
			userId,
			dto.challengeId
		)
	}
	@ApiOperation({
		summary: 'Create challenge'
	})
	@ApiOkResponse({
		type: ChallengeResponse
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized'
	})
	@Protected()
	@Post()
	async createChallenge(@Body() dto: CreateChallengeRequest) {
		return await this.challengesService.createChallenge(dto)
	}

	@ApiOperation({
		summary: 'Get Challenge By Id'
	})
	@ApiOkResponse({
		type: ChallengeResponse
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized'
	})
	@Protected()
	@Get(':challengeId')
	async getChallengeById(@Param('challengeId') challengeId: string) {
		return this.challengesService.getChallengeById(challengeId)
	}

	@ApiOperation({
		summary: 'Update Challenge By Id'
	})
	@ApiOkResponse({
		type: ChallengeResponse
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized'
	})
	@Protected()
	@Put(':challengeId')
	async updateChallenge(
		@Param('challengeId') challengeId: string,
		@Body() dto: UpdateChallengeRequest
	) {
		return this.challengesService.updateChallenge(challengeId, dto)
	}

	@ApiOperation({
		summary: 'Delete Challenge By Id'
	})
	@ApiOkResponse({
		type: ChallengeResponse
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized'
	})
	@Protected()
	@Delete(':challengeId')
	async deleteChallenge(@Param('challengeId') challengeId: string) {
		return this.challengesService.deleteChallenge(challengeId)
	}
}
