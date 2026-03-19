import {
  WorkoutDaysRepository,
  WorkoutDayWithExercisesAndSessions,
} from '@/repositories/workout-days-repository'
import { WorkoutPlansRepository } from '@/repositories/workout-plans-repository'

import { ResourceNotFoundError } from './erros/resource-not-found-error'

interface GetWorkoutDayUseCaseRequest {
  userId: string
  workoutPlanId: string
  workoutDayId: string
}

interface GetWorkoutDayUseCaseResponse {
  workoutDay: WorkoutDayWithExercisesAndSessions
}

export class GetWorkoutDayUseCase {
  constructor(
    private workoutPlansRespository: WorkoutPlansRepository,
    private workoutDaysRespository: WorkoutDaysRepository
  ) {}

  async execute({
    userId,
    workoutPlanId,
    workoutDayId,
  }: GetWorkoutDayUseCaseRequest): Promise<GetWorkoutDayUseCaseResponse> {
    const workoutPlan =
      await this.workoutPlansRespository.findById(workoutPlanId)

    if (!workoutPlan || workoutPlan.userId !== userId) {
      throw new ResourceNotFoundError('Workout plan not found.')
    }

    const workoutDay = await this.workoutDaysRespository.findByPlanAndDayId({
      workoutDayId,
      workoutPlanId,
    })

    if (!workoutDay) {
      throw new ResourceNotFoundError('Workout day not found.')
    }

    return {
      workoutDay,
    }
  }
}
