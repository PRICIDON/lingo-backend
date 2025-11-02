import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'
import { Request } from 'express'

import { UsersService } from '../../api/users/users.service'

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private readonly userService: UsersService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest() as Request

		if (typeof request.session.userId === 'undefined')
			throw new UnauthorizedException(
				'Пользователь не авторизован. Пожалуйста, войдите в систему, чтобы получить доступ.'
			)

		const user = await this.userService.findById(request.session.userId)

		request.user = user

		return true
	}
}
