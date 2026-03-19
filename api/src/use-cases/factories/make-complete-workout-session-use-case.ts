import { PrismaWorkoutDaysRepository } from '@/repositories/prisma/prisma-workout-days-repostiory'
import { PrismaWorkoutPlansRepository } from '@/repositories/prisma/prisma-workout-plans-repostiory'
import { PrismaWorkoutSessionsRepository } from '@/repositories/prisma/prisma-workout-sessions-repository'

import { CompleteWorkoutSessionUseCase } from '../complete-workout-session-use-case'

export function makeCompleteWorkoutSessionUseCase() {
  return new CompleteWorkoutSessionUseCase(
    new PrismaWorkoutPlansRepository(),
    new PrismaWorkoutDaysRepository(),
    new PrismaWorkoutSessionsRepository()
  )
}
