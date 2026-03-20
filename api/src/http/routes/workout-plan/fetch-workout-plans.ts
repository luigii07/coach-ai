import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

import { verifyAuthentication } from '@/http/middlewares/verify-authentication'
import { errorSchema } from '@/schemas/error'
import {
  fetchWorkoutPlansQuerySchema,
  fetchWorkoutPlansResponseSchema,
} from '@/schemas/workout-plans'
import { UnauthorizedError } from '@/use-cases/erros/unauthorized-error'
import { makeFetchWorkoutPlansUseCase } from '@/use-cases/factories/make-fetch-workout-plans-use-case'

export const fetchWorkoutPlans: FastifyPluginAsyncZod = async (app) => {
  app.register(verifyAuthentication)

  app.get(
    '/',
    {
      schema: {
        operationId: 'fetchWorkoutPlan',
        tags: ['Workout Plan'],
        summary: 'Fetch workout plans',
        querystring: fetchWorkoutPlansQuerySchema,
        response: {
          200: fetchWorkoutPlansResponseSchema,
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

      const fetchWorkoutPlansUseCase = makeFetchWorkoutPlansUseCase()

      const { workoutPlans } = await fetchWorkoutPlansUseCase.execute({
        userId: session.user.id,
        isActive: request.query.isActive,
      })

      const formatedWorkoutPlans = workoutPlans.map((workoutPlan) => ({
        ...workoutPlan,
        workoutDays: workoutPlan.workoutDays.map((workoutDay) => ({
          ...workoutDay,
          coverImageUrl: workoutDay.coverImageUrl ?? undefined,
          exercises: workoutDay.exercises.map((exercise) => ({
            ...exercise,
          })),
        })),
      }))

      return reply.status(200).send({
        workoutPlans: formatedWorkoutPlans,
      })
    }
  )
}
