import { Prisma } from '../../generated/prisma/client'

export type WorkoutDayWithExercisesAndSessions = Prisma.WorkoutDayGetPayload<{
  include: { exercises: true; workoutSessions: true }
}>

export interface WorkoutDaysRepository {
  findByPlanAndDayId({
    workoutDayId,
    workoutPlanId,
  }: {
    workoutDayId: string
    workoutPlanId: string
  }): Promise<WorkoutDayWithExercisesAndSessions | null>
}
