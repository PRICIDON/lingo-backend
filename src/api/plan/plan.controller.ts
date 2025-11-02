import { Controller, Get, Param } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'

import { PlanResponse } from './dto/plan.dto'
import { PlanService } from './plan.service'

@ApiTags('Plans')
@Controller('plans')
export class PlanController {
	constructor(private readonly planService: PlanService) {}

	@ApiOperation({
		summary: 'Get all subscription plans',
		description:
			'Returns a list of all available plans, sorted by monthly price'
	})
	@ApiOkResponse({
		type: [PlanResponse]
	})
	@Get()
	async getAll() {
		return await this.planService.getAll()
	}

	@ApiOperation({
		summary: 'Get subscription plan by ID',
		description:
			'Returns detailed information about a specific plan by its ID'
	})
	@ApiOkResponse({
		type: PlanResponse
	})
	@Get(':id')
	async getPlanById(@Param('id') id: string) {
		return await this.planService.getPlanById(id)
	}
}
