import { z } from 'zod'

import { WeekDay } from '../../generated/prisma/enums'

export const createWorkoutPlanBodySchema = z.object({
  name: z.string().trim().min(1),
  workoutDays: z.array(
    z.object({
      name: z.string().trim().min(1),
      weekDay: z.enum(WeekDay),
      isRest: z.boolean().default(false),
      estimatedDurationInSeconds: z.number().min(1),
      coverImageUrl: z.url().optional(),
      exercises: z.array(
        z.object({
          name: z.string().trim().min(1),
          order: z.number().min(0),
          sets: z.number().min(1),
          reps: z.number().min(1),
          restTimeInSeconds: z.number().min(1),
        })
      ),
    })
  ),
})

export const workoutPlanResponseSchema = z.object({
  workoutPlan: z.object({
    id: z.uuid(),
    name: z.string().trim().min(1),
    workoutDays: z.array(
      z.object({
        name: z.string().trim().min(1),
        weekDay: z.enum(WeekDay),
        isRest: z.boolean().default(false),
        estimatedDurationInSeconds: z.number().min(1),
        coverImageUrl: z.url().optional(),
        exercises: z.array(
          z.object({
            name: z.string().trim().min(1),
            order: z.number().min(0),
            sets: z.number().min(1),
            reps: z.number().min(1),
            restTimeInSeconds: z.number().min(1),
          })
        ),
      })
    ),
  }),
})

export const getWorkoutPlanParamsSchema = z.object({
  workoutPlanId: z.uuid(),
})

export const fetchWorkoutPlansQuerySchema = z.object({
  isActive: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
})

export const fetchWorkoutPlansResponseSchema = z.object({
  workoutPlans: z.array(
    z.object({
      id: z.uuid(),
      name: z.string().trim().min(1),
      workoutDays: z.array(
        z.object({
          name: z.string().trim().min(1),
          weekDay: z.enum(WeekDay),
          isRest: z.boolean().default(false),
          estimatedDurationInSeconds: z.number().min(1),
          coverImageUrl: z.url().optional(),
          exercises: z.array(
            z.object({
              name: z.string().trim().min(1),
              order: z.number().min(0),
              sets: z.number().min(1),
              reps: z.number().min(1),
              restTimeInSeconds: z.number().min(1),
            })
          ),
        })
      ),
    })
  ),
})
