import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

import { verifyAuthentication } from '@/http/middlewares/verify-authentication'
import { errorSchema } from '@/schemas/error'
import {
  getWorkoutPlanParamsSchema,
  workoutPlanResponseSchema,
} from '@/schemas/workout-plans'
import { UnauthorizedError } from '@/use-cases/erros/unauthorized-error'
import { makeGetWorkoutPlanUseCase } from '@/use-cases/factories/make-get-workout-plan-use-case'

export const getWorkoutPlan: FastifyPluginAsyncZod = async (app) => {
  app.register(verifyAuthentication)

  app.get(
    '/:workoutPlanId',
    {
      schema: {
        tags: ['Workout Plan'],
        summary: 'Get a workout plan',
        params: getWorkoutPlanParamsSchema,
        response: {
          200: workoutPlanResponseSchema,
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

      const getWorkoutPlanUseCase = makeGetWorkoutPlanUseCase()

      const { workoutPlan } = await getWorkoutPlanUseCase.execute({
        userId: session.user.id,
        workoutPlanId: request.params.workoutPlanId,
      })

      return reply.status(200).send({
        workoutPlan: {
          id: workoutPlan.id,
          name: workoutPlan.name,
          workoutDays: workoutPlan.workoutDays.map((workoutDay) => ({
            ...workoutDay,
            coverImageUrl: workoutDay.coverImageUrl ?? undefined,
          })),
        },
      })
    }
  )
}
