import { ApiProperty } from '@nestjs/swagger'
import {
	IsEmail,
	IsNotEmpty,
	IsString,
	MinLength,
	Validate
} from 'class-validator'

import { IsPasswordsMatchingConstraint } from '../../../common/decorators/is-passwords-matching-constraint.decorator'

export class RegisterRequest {
	@ApiProperty({
		example: 'John Doe',
		description: 'Name of the user'
	})
	@IsString({ message: 'Имя должно быть строкой.' })
	@IsNotEmpty({ message: 'Имя обязательно для заполнения.' })
	name: string
	@ApiProperty({
		example: 'john@example.com',
		description: 'Email address of the user'
	})
	@IsString({ message: 'Email должен быть строкой.' })
	@IsEmail({}, { message: 'Некорректный формат email.' })
	@IsNotEmpty({ message: 'Email обязателен для заполнения.' })
	email: string
	@ApiProperty({
		example: 'strongPassword123',
		description: 'Password for the account'
	})
	@IsString({ message: 'Пароль должен быть строкой.' })
	@IsNotEmpty({ message: 'Пароль обязателен для заполнения.' })
	@MinLength(6, { message: 'Пароль должен содержать минимум 6 символов.' })
	password: string
	@IsString({ message: 'Пароль подтверждения должен быть строкой.' })
	@IsNotEmpty({ message: 'Поле подтверждения пароля не может быть пустым.' })
	@MinLength(6, {
		message: 'Пароль подтверждения должен содержать не менее 6 символов.'
	})
	@Validate(IsPasswordsMatchingConstraint, {
		message: 'Пароли не совпадают.'
	})
	passwordRepeat: string
}
