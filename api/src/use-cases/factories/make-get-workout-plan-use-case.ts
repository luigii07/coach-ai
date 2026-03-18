import { PrismaWorkoutPlansRepository } from '@/repositories/prisma/prisma-workout-plans-repostiory'

import { GetWorkoutPlanUseCase } from '../get-workout-plan-use-case'

export function makeGetWorkoutPlanUseCase() {
  return new GetWorkoutPlanUseCase(new PrismaWorkoutPlansRepository())
}
