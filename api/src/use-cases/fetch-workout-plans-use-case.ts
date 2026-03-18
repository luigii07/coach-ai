import {
  WorkoutPlansRepository,
  WorkoutPlanWithDaysAndExercises,
} from '@/repositories/workout-plans-repostiory'

interface FetchWorkoutPlansUseCaseRequest {
  userId: string
  isActive?: boolean
}

interface FetchWorkoutPlansUseCaseResponse {
  workoutPlans: WorkoutPlanWithDaysAndExercises[]
}

export class FetchWorkoutPlansUseCase {
  constructor(private workoutPlansRepository: WorkoutPlansRepository) {}

  async execute({
    userId,
    isActive,
  }: FetchWorkoutPlansUseCaseRequest): Promise<FetchWorkoutPlansUseCaseResponse> {
    const workoutPlans = await this.workoutPlansRepository.findManyByUserId(
      userId,
      isActive
    )

    return {
      workoutPlans,
    }
  }
}
