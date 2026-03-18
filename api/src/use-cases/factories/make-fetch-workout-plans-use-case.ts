import { PrismaWorkoutPlansRepository } from '@/repositories/prisma/prisma-workout-plans-repostiory'

import { FetchWorkoutPlansUseCase } from '../fetch-workout-plans-use-case'

export function makeFetchWorkoutPlansUseCase() {
  return new FetchWorkoutPlansUseCase(new PrismaWorkoutPlansRepository())
}
