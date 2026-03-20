import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

import { verifyAuthentication } from '@/http/middlewares/verify-authentication'
import { errorSchema } from '@/schemas/error'
import {
  createWorkoutPlanBodySchema,
  workoutPlanResponseSchema,
} from '@/schemas/workout-plans'
import { UnauthorizedError } from '@/use-cases/erros/unauthorized-error'
import { makeCreateWorkoutPlanUseCase } from '@/use-cases/factories/make-create-workout-plan-use-case'

export const createWorkoutPlan: FastifyPluginAsyncZod = async (app) => {
  app.register(verifyAuthentication)

  app.post(
    '/',
    {
      schema: {
        operationId: 'createWorkoutPlan',
        tags: ['Workout Plan'],
        summary: 'Create a workout plan',
        body: createWorkoutPlanBodySchema,
        response: {
          201: workoutPlanResponseSchema,
          400: errorSchema,
          401: errorSchema,
          500: errorSchema,
        },
      },
    },
    async (request, reply) => {
      const session = request.session

      if (!session) {
        throw new UnauthorizedError()
      }

      const createWorkoutPlanUseCase = makeCreateWorkoutPlanUseCase()

      const { workoutPlan } = await createWorkoutPlanUseCase.execute({
        name: request.body.name,
        userId: session.user.id,
        workoutDays: request.body.workoutDays,
      })

      return reply.status(201).send({
        workoutPlan: {
          ...workoutPlan,
          workoutDays: workoutPlan.workoutDays.map((workoutDay) => ({
            ...workoutDay,
            coverImageUrl: workoutDay.coverImageUrl ?? undefined,
          })),
        },
      })
    }
  )
}
