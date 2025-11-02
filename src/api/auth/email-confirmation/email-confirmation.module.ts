import { forwardRef, Module } from '@nestjs/common'

import { MailModule } from '../../../libs/mail/mail.module'
import { UsersModule } from '../../users/users.module'
import { AuthModule } from '../auth.module'

import { EmailConfirmationController } from './email-confirmation.controller'
import { EmailConfirmationService } from './email-confirmation.service'

@Module({
	imports: [MailModule, forwardRef(() => AuthModule), UsersModule],
	controllers: [EmailConfirmationController],
	providers: [EmailConfirmationService],
	exports: [EmailConfirmationService]
})
export class EmailConfirmationModule {}
