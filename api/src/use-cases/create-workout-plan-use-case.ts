import {
  WorkoutPlansRepository,
  WorkoutPlanWithDaysAndExercises,
} from '@/repositories/workout-plans-repository'

import { WeekDay } from '../../generated/prisma/enums'

interface CreateWorkoutPlanUseCaseRequest {
  userId: string
  name: string
  workoutDays: Array<{
    name: string
    weekDay: WeekDay
    isRest: boolean
    estimatedDurationInSeconds: number
    coverImageUrl?: string
    exercises: Array<{
      order: number
      name: string
      sets: number
      reps: number
      restTimeInSeconds: number
    }>
  }>
}

interface CreateWorkoutPlanUseCaseResponse {
  workoutPlan: WorkoutPlanWithDaysAndExercises
}

export class CreateWorkoutPlanUseCase {
  constructor(private workoutPlansRespository: WorkoutPlansRepository) {}

  async execute({
    name,
    userId,
    workoutDays,
  }: CreateWorkoutPlanUseCaseRequest): Promise<CreateWorkoutPlanUseCaseResponse> {
    const workoutPlan = await this.workoutPlansRespository.createAsAcitive({
      name,
      userId,
      workoutDays: workoutDays.map((day) => ({
        ...day,
        coverImageUrl: day.coverImageUrl ?? null,
      })),
    })

    return {
      workoutPlan,
    }
  }
}
