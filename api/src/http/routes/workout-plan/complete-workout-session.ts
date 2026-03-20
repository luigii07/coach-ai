import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

import { verifyAuthentication } from '@/http/middlewares/verify-authentication'
import { errorSchema } from '@/schemas/error'
import {
  completeWorkoutSessionBodySchema,
  completeWorkoutSessionParamsSchema,
  completeWorkoutSessionResponseSchema,
} from '@/schemas/workout-session'
import { UnauthorizedError } from '@/use-cases/erros/unauthorized-error'
import { makeCompleteWorkoutSessionUseCase } from '@/use-cases/factories/make-complete-workout-session-use-case'

export const completeWorkoutSession: FastifyPluginAsyncZod = async (app) => {
  app.register(verifyAuthentication)

  app.patch(
    '/:workoutPlanId/days/:workoutDayId/sessions/:workoutSessionId',
    {
      schema: {
        operationId: 'completeWorkoutSession',
        tags: ['Workout Plan'],
        summary: 'Complete a workout session',
        params: completeWorkoutSessionParamsSchema,
        body: completeWorkoutSessionBodySchema,
        response: {
          200: completeWorkoutSessionResponseSchema,
          400: errorSchema,
          401: errorSchema,
          404: errorSchema,
          500: errorSchema,
        },
      },
    },
    async (request, reply) => {
      const session = request.session

      if (!session) {
        throw new UnauthorizedError()
      }

      const completeWorkoutSession = makeCompleteWorkoutSessionUseCase()

      const { id, startedAt, completedAt } =
        await completeWorkoutSession.execute({
          userId: session.user.id,
          sessionId: request.params.workoutSessionId,
          workoutPlanId: request.params.workoutPlanId,
          workoutDayId: request.params.workoutDayId,
          completedAt: request.body.completedAt,
        })

      return reply.status(200).send({
        id,
        startedAt,
        completedAt,
      })
    }
  )
}
