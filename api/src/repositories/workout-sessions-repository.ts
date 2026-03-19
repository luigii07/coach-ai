import { WorkoutSession } from '../../generated/prisma/client'

export interface WorkoutSessionsRepository {
  findByWorkoutDayIdOnDate(
    workoutDayId: string,
    date: Date
  ): Promise<WorkoutSession | null>
  create(workoutDayId: string): Promise<WorkoutSession>
  findById(sessionId: string): Promise<WorkoutSession | null>
  update({
    sessionId,
    completedAt,
  }: {
    sessionId: string
    completedAt: Date
  }): Promise<WorkoutSession>
}
