import { Module } from '@nestjs/common'

import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module';
import { UnitsModule } from './units/units.module';
import { CoursesModule } from './courses/courses.module';
import { LessonsModule } from './lessons/lessons.module';
import { ChallengesModule } from './challenges/challenges.module';
import { ChallengeOptionsModule } from './challenge-options/challenge-options.module';
import { PlanModule } from './plan/plan.module';
import { PaymentModule } from './payment/payment.module';

@Module({
	imports: [AuthModule, UsersModule, UnitsModule, CoursesModule, LessonsModule, ChallengesModule, ChallengeOptionsModule, PlanModule, PaymentModule]
})
export class ApiModule {}
