import { PrismaWorkoutPlansRepository } from '@/repositories/prisma/prisma-workout-plans-repostiory'
import { PrismaWorkoutSessionsRepository } from '@/repositories/prisma/prisma-workout-sessions-repository'

import { GetWorkoutPlanStatsUseCase } from '../get-workout-plan-stats-use-case'

export function makeGetWorkoutPlanStatsUseCase() {
  return new GetWorkoutPlanStatsUseCase(
    new PrismaWorkoutPlansRepository(),
    new PrismaWorkoutSessionsRepository()
  )
}

