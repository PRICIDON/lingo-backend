import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class UpdateUserRequest {
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

	@IsBoolean({ message: 'isTwoFactorEnabled должно быть булевым значением.' })
	isTwoFactorEnabled: boolean
}
