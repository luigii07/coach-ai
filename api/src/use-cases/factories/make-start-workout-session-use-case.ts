import { PrismaWorkoutDaysRepository } from '@/repositories/prisma/prisma-workout-days-repostiory'
import { PrismaWorkoutPlansRepository } from '@/repositories/prisma/prisma-workout-plans-repostiory'
import { PrismaWorkoutSessionsRepository } from '@/repositories/prisma/prisma-workout-sessions-repository'

import { StartWorkoutSessionUseCase } from '../start-workout-session-use-case'

export function makeStartWorkoutSessionUseCase() {
  return new StartWorkoutSessionUseCase(
    new PrismaWorkoutPlansRepository(),
    new PrismaWorkoutDaysRepository(),
    new PrismaWorkoutSessionsRepository()
  )
}
