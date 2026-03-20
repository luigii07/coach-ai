import { PrismaWorkoutPlansRepository } from '@/repositories/prisma/prisma-workout-plans-repostiory'
import { PrismaWorkoutSessionsRepository } from '@/repositories/prisma/prisma-workout-sessions-repository'

import { GetHomeDataUseCase } from '../get-home-data-use-case'

export function makeGetHomeDataUseCase() {
  return new GetHomeDataUseCase(
    new PrismaWorkoutPlansRepository(),
    new PrismaWorkoutSessionsRepository()
  )
}
