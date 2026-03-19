import { z } from 'zod'

import { WeekDay } from '../../generated/prisma/enums'

export const getWorkoutDayResponseSchema = z.object({
  workoutDay: z.object({
    id: z.uuid(),
    name: z.string(),
    isRest: z.boolean(),
    coverImageUrl: z.url().optional(),
    estimatedDurationInSeconds: z.number(),
    weekDay: z.enum(WeekDay),
    exercises: z.array(
      z.object({
        id: z.uuid(),
        name: z.string(),
        order: z.number(),
        workoutDayId: z.uuid(),
        sets: z.number(),
        reps: z.number(),
        restTimeInSeconds: z.number(),
      })
    ),
    sessions: z.array(
      z.object({
        id: z.uuid(),
        workoutDayId: z.uuid(),
        startedAt: z.iso.date().optional(),
        completedAt: z.iso.date().optional(),
      })
    ),
  }),
})

export const getWorkoutDayParamsSchema = z.object({
  workoutPlanId: z.uuid(),
  workoutDayId: z.uuid(),
})
