import { WorkoutSession } from '../../generated/prisma/client'

export interface WorkoutSessionsRepository {
  findByWorkoutDayIdOnDate(
    workoutDayId: string,
    date: Date
  ): Promise<WorkoutSession | null>
  create(workoutDayId: string): Promise<WorkoutSession>
}
