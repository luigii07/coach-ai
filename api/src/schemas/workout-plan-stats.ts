import { z } from 'zod'

export const getWorkoutPlanStatsQuerySchema = z.object({
  from: z.iso.date(),
  to: z.iso.date(),
})

export const getWorkoutPlanStatsResponseSchema = z.object({
  workoutStreak: z.number(),
  consistencyByDay: z.record(
    z.string(),
    z.object({
      workoutDayStarted: z.boolean(),
      workoutDayCompleted: z.boolean(),
    })
  ),
  completedWorkoutsCount: z.number(),
  conclusionRate: z.number(),
  totalTimeInSeconds: z.number(),
})

export type GetWorkoutPlanStatsResponse = z.infer<
  typeof getWorkoutPlanStatsResponseSchema
>
