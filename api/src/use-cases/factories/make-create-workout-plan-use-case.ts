import { PrismaWorkoutPlansRepository } from '@/repositories/prisma/prisma-workout-plans-repostiory'

import { CreateWorkoutPlanUseCase } from '../create-workout-plan-use-case'

export function makeCreateWorkoutPlanUseCase() {
  return new CreateWorkoutPlanUseCase(new PrismaWorkoutPlansRepository())
}
