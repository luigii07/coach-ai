import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

import { verifyAuthentication } from '@/http/middlewares/verify-authentication'
import { errorSchema } from '@/schemas/error'
import {
  getWorkoutPlanStatsQuerySchema,
  getWorkoutPlanStatsResponseSchema,
} from '@/schemas/workout-plan-stats'
import { getWorkoutPlanParamsSchema } from '@/schemas/workout-plans'
import { UnauthorizedError } from '@/use-cases/erros/unauthorized-error'
import { makeGetWorkoutPlanStatsUseCase } from '@/use-cases/factories/make-get-workout-plan-stats-use-case'

export const getWorkoutPlanStats: FastifyPluginAsyncZod = async (app) => {
  app.register(verifyAuthentication)

  app.get(
    '/:workoutPlanId/stats',
    {
      schema: {
        tags: ['Workout Plan'],
        summary: 'Get workout plan stats',
        params: getWorkoutPlanParamsSchema,
        querystring: getWorkoutPlanStatsQuerySchema,
        response: {
          200: getWorkoutPlanStatsResponseSchema,
          400: errorSchema,
          401: errorSchema,
          404: errorSchema,
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

      const getWorkoutPlanStatsUseCase = makeGetWorkoutPlanStatsUseCase()

      const stats = await getWorkoutPlanStatsUseCase.execute({
        userId: session.user.id,
        workoutPlanId: request.params.workoutPlanId,
        from: request.query.from,
        to: request.query.to,
      })

      return reply.status(200).send(stats)
    }
  )
}
