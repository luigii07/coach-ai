import { z } from 'zod'

export const getUserProfileResponseSchema = z.object({
  user: z.object({
    id: z.string(),
    name: z.string(),
    age: z.number().nullable(),
    weightInGrams: z.number().nullable(),
    bodyFatPercentage: z.number().min(0).max(100).nullable(),
    heightInCentimeters: z.number().nullable(),
  }),
})

export const updateUserTrainingMetricsBodySchema = z.object({
  weightInGrams: z.number().min(1),
  heightInCentimeters: z.number().min(1),
  age: z.number().min(1),
  bodyFatPercentage: z.number().min(1).max(100),
})
