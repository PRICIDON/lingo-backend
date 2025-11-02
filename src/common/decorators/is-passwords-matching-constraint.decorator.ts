import {
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface
} from 'class-validator'

import { RegisterRequest } from '../../api/auth/dto/register.dto'

@ValidatorConstraint({ name: 'IsPasswordsMatching', async: false })
export class IsPasswordsMatchingConstraint
	implements ValidatorConstraintInterface
{
	validate(passwordRepeat: string, args: ValidationArguments) {
		const obj = args.object as RegisterRequest
		return obj.password === passwordRepeat
	}
	defaultMessage(validationArguments?: ValidationArguments) {
		return 'Пароли не совпадают'
	}
}
