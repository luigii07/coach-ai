import {
  WorkoutPlansRepository,
  WorkoutPlanWithDaysAndExercises,
} from '@/repositories/workout-plans-repostiory'

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
      await this.workoutPlansRespository.findById(workoutPlanId)

    if (!workoutPlan || workoutPlan.userId !== userId) {
      throw new ResourceNotFoundError()
    }

    return {
      workoutPlan,
    }
  }
}
