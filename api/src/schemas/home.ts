import { z } from 'zod'

import { WeekDay } from '../../generated/prisma/enums'

export const getHomeDataQuerySchema = z.object({
  date: z.iso.date(),
})

export const getHomeDataResponseSchema = z.object({
  activeWorkoutPlanId: z.uuid(),
  todayWorkoutDay: z.object({
    id: z.uuid(),
    name: z.string(),
    isRest: z.boolean(),
    weekDay: z.enum(WeekDay),
    estimatedDurationInSeconds: z.number(),
    coverImageUrl: z.url().optional(),
    exercisesCount: z.number(),
    workoutPlanId: z.uuid(),
  }),
  workoutStreak: z.number(),
  consistencyByDay: z.record(
    z.string(),
    z.object({
      workoutDayStarted: z.boolean(),
      workoutDayCompleted: z.boolean(),
    })
  ),
})
