import { Module } from '@nestjs/common'

import { CoursesModule } from '../courses/courses.module'
import { UsersModule } from '../users/users.module'

import { LessonsController } from './lessons.controller'
import { LessonsService } from './lessons.service'

@Module({
	controllers: [LessonsController],
	providers: [LessonsService],
	imports: [CoursesModule, UsersModule]
})
export class LessonsModule {}
