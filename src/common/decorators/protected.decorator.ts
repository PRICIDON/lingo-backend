import { applyDecorators, UseGuards } from '@nestjs/common'
import { Role } from '@prisma/client'

import { AuthGuard } from '../guards/auth.guard'
import { RolesGuard } from '../guards/roles.guard'

import { Roles } from './roles.decorator'

export function Protected(...roles: Role[]) {
	if (roles.length > 0) {
		return applyDecorators(
			Roles(...roles),
			UseGuards(AuthGuard, RolesGuard)
		)
	}
	return applyDecorators(UseGuards(AuthGuard))
}
