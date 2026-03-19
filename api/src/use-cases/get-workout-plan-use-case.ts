import {
  WorkoutPlansRepository,
  WorkoutPlanWithDaysAndExercises,
} from '@/repositories/workout-plans-repository'

import { ResourceNotFoundError } from './erros/resource-not-found-error'

interface GetWorkoutPlanUseCaseRequest {
  userId: string
  workoutPlanId: string
}

interface GetWorkoutPlanUseCaseResponse {
  workoutPlan: WorkoutPlanWithDaysAndExercises
}

export class GetWorkoutPlanUseCase {
  constructor(private workoutPlansRespository: WorkoutPlansRepository) {}

  async execute({
    userId,
    workoutPlanId,
  }: GetWorkoutPlanUseCaseRequest): Promise<GetWorkoutPlanUseCaseResponse> {
    const workoutPlan =
      await this.workoutPlansRespository.findByIdWithDaysAndExercises(
        workoutPlanId
      )

    if (!workoutPlan || workoutPlan.userId !== userId) {
      throw new ResourceNotFoundError('Workout plan not found.')
    }

    return {
      workoutPlan,
    }
  }
}
