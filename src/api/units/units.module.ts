import { Module } from '@nestjs/common'

import { UsersModule } from '../users/users.module'

import { UnitsController } from './units.controller'
import { UnitsService } from './units.service'

@Module({
	controllers: [UnitsController],
	providers: [UnitsService],
	imports: [UsersModule]
})
export class UnitsModule {}
