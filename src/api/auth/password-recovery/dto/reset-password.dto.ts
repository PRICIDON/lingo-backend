import { IsEmail, IsNotEmpty } from 'class-validator'

export class ResetPasswordRequest {
	@IsEmail({}, { message: 'Введите корректный адрес электронной почты.' })
	@IsNotEmpty({ message: 'Поле email не может быть пустым.' })
	email: string
}
