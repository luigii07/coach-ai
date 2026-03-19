import { z } from 'zod'

export const startWorkoutSessionParamsSchema = z.object({
  workoutPlanId: z.uuid(),
  workoutDayId: z.uuid(),
})

export const startWorkoutSessionBodySchema = z.object({}).optional()

export const startWorkoutSessionResponseSchema = z.object({
  userWorkoutSessionId: z.uuid(),
})
