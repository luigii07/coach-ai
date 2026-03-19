import { PrismaWorkoutDaysRepository } from '@/repositories/prisma/prisma-workout-days-repostiory'
import { PrismaWorkoutPlansRepository } from '@/repositories/prisma/prisma-workout-plans-repostiory'

import { GetWorkoutDayUseCase } from '../get-workout-day-use-case'

export function makeGetWorkoutDayUseCase() {
  return new GetWorkoutDayUseCase(
    new PrismaWorkoutPlansRepository(),
    new PrismaWorkoutDaysRepository()
  )
}
