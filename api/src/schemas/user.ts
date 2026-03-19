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
