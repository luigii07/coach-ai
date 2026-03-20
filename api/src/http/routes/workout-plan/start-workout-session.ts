import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

import { verifyAuthentication } from '@/http/middlewares/verify-authentication'
import { errorSchema } from '@/schemas/error'
import {
  startWorkoutSessionBodySchema,
  startWorkoutSessionParamsSchema,
  startWorkoutSessionResponseSchema,
} from '@/schemas/workout-session'
import { UnauthorizedError } from '@/use-cases/erros/unauthorized-error'
import { makeStartWorkoutSessionUseCase } from '@/use-cases/factories/make-start-workout-session-use-case'

export const startWorkoutSession: FastifyPluginAsyncZod = async (app) => {
  app.register(verifyAuthentication)

  app.post(
    '/:workoutPlanId/days/:workoutDayId/sessions',
    {
      schema: {
        operationId: 'startWorkoutSession',
        tags: ['Workout Plan'],
        summary: 'Start a workout session',
        params: startWorkoutSessionParamsSchema,
        body: startWorkoutSessionBodySchema,
        response: {
          201: startWorkoutSessionResponseSchema,
          400: errorSchema,
          401: errorSchema,
          404: errorSchema,
          409: errorSchema,
          422: errorSchema,
          500: errorSchema,
        },
      },
    },
    async (request, reply) => {
      const session = request.session

      if (!session) {
        throw new UnauthorizedError()
      }

      const startWorkoutSessionUseCase = makeStartWorkoutSessionUseCase()

      const { userWorkoutSessionId } = await startWorkoutSessionUseCase.execute(
        {
          userId: session.user.id,
          workoutDayId: request.params.workoutDayId,
          workoutPlanId: request.params.workoutPlanId,
        }
      )

      return reply.status(201).send({
        userWorkoutSessionId,
      })
    }
  )
}
