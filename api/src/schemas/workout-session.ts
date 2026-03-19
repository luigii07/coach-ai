import { z } from 'zod'

export const startWorkoutSessionParamsSchema = z.object({
  workoutPlanId: z.uuid(),
  workoutDayId: z.uuid(),
})

export const startWorkoutSessionBodySchema = z.object({}).optional()

export const startWorkoutSessionResponseSchema = z.object({
  userWorkoutSessionId: z.uuid(),
})

export const completeWorkoutSessionParamsSchema = z.object({
  workoutPlanId: z.uuid(),
  workoutDayId: z.uuid(),
  workoutSessionId: z.uuid(),
})

export const completeWorkoutSessionBodySchema = z.object({
  completedAt: z.iso.datetime(),
})

export const completeWorkoutSessionResponseSchema = z.object({
  id: z.uuid(),
  startedAt: z.iso.datetime(),
  completedAt: z.iso.datetime(),
})
