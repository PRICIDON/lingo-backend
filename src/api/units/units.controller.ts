import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import {
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse
} from '@nestjs/swagger'

import { Authorized } from '../../common/decorators/authorized.decorator'
import { Protected } from '../../common/decorators/protected.decorator'

import { GetUnitsResponse } from './dto/get-units.dto'
import {
	CreateUnitRequest,
	UnitResponse,
	UpdateUnitRequest
} from './dto/unit.dto'
import { UnitsService } from './units.service'

@ApiTags('Units')
@Controller('units')
export class UnitsController {
	constructor(private readonly unitsService: UnitsService) {}

	@ApiOperation({
		summary: 'Get units in ACTIVE Course'
	})
	@ApiOkResponse({
		type: [GetUnitsResponse]
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized'
	})
	@Protected()
	@Get('in-active-course')
	async getUnitsInActiveCourse(@Authorized('id') id: string) {
		return await this.unitsService.getUnitsInActiveCourse(id)
	}

	@ApiOperation({
		summary: 'Get units'
	})
	@ApiOkResponse({
		type: [UnitResponse]
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized'
	})
	@Protected()
	@Get()
	async getUnits() {
		return await this.unitsService.getUnits()
	}

	@ApiOperation({
		summary: 'Create unit'
	})
	@ApiOkResponse({
		type: UnitResponse
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized'
	})
	@Protected()
	@Post()
	async createUnit(@Body() dto: CreateUnitRequest) {
		return await this.unitsService.createUnit(dto)
	}

	@ApiOperation({
		summary: 'Update unit'
	})
	@ApiOkResponse({
		type: UnitResponse
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized'
	})
	@Protected()
	@Put(':unitId')
	async updateUnit(
		@Param('unitId') unitId: string,
		@Body() dto: UpdateUnitRequest
	) {
		return await this.unitsService.updateUnit(unitId, dto)
	}

	@ApiOperation({
		summary: 'Delete unit'
	})
	@ApiOkResponse({
		type: UnitResponse
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized'
	})
	@Protected()
	@Delete(':unitId')
	async deleteUnit(@Param('unitId') unitId: string) {
		return await this.unitsService.deleteUnit(unitId)
	}

	@ApiOperation({
		summary: 'Get unit by Id'
	})
	@ApiOkResponse({
		type: UnitResponse
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized'
	})
	@Protected()
	@Get(':unitId')
	async getUnitById(@Param('unitId') unitId: string) {
		return await this.unitsService.getUnitById(unitId)
	}
}
