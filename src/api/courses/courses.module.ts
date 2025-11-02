import { Module } from '@nestjs/common'

import { UsersModule } from '../users/users.module'

import { CoursesController } from './courses.controller'
import { CoursesService } from './courses.service'

@Module({
	controllers: [CoursesController],
	providers: [CoursesService],
	imports: [UsersModule],
	exports: [CoursesService]
})
export class CoursesModule {}
