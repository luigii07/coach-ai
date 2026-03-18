import { WorkoutPlansRepository } from '@/repositories/workout-plans-repostiory'

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
  id: string
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
      id: workoutPlan.id,
      name: workoutPlan.name,
      workoutDays: workoutPlan.workoutDays.map((workoutDay) => ({
        ...workoutDay,
        coverImageUrl: workoutDay.coverImageUrl ?? undefined,
        exercises: workoutDay.exercises.map((exercise) => ({
          ...exercise,
        })),
      })),
    }
  }
}
