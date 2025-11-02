import { ApiProperty } from '@nestjs/swagger'
import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	MinLength
} from 'class-validator'

export class LoginRequest {
	@ApiProperty({
		example: 'john@example.com',
		description: 'Email address of the user'
	})
	@IsEmail({}, { message: 'Email должен быть строкой.' })
	@IsString({ message: 'Некорректный формат email.' })
	@IsNotEmpty({ message: 'Email обязателен для заполнения.' })
	email: string
	@ApiProperty({
		example: 'strongPassword123',
		description: 'Password for the account'
	})
	@IsString({ message: 'Пароль должен быть строкой.' })
	@IsNotEmpty({ message: 'Поле рароль не может быть пустым.' })
	@MinLength(6, { message: 'Пароль должен содержать не менее 6 символов' })
	password: string

	@IsOptional()
	@IsString()
	code: string
}
