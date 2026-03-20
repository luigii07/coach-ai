import 'dayjs/plugin/utc.js'

import dayjs from 'dayjs'
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

import { verifyAuthentication } from '@/http/middlewares/verify-authentication'
import { errorSchema } from '@/schemas/error'
import {
  getWorkoutDayParamsSchema,
  getWorkoutDayResponseSchema,
} from '@/schemas/workout-days'
import { UnauthorizedError } from '@/use-cases/erros/unauthorized-error'
import { makeGetWorkoutDayUseCase } from '@/use-cases/factories/make-get-workout-day-use-case'

export const getWorkoutDay: FastifyPluginAsyncZod = async (app) => {
  app.register(verifyAuthentication)

  app.get(
    '/:workoutPlanId/days/:workoutDayId',
    {
      schema: {
        operationId: 'getWorkoutDay',
        tags: ['Workout Plan'],
        summary: 'Get a workout day',
        params: getWorkoutDayParamsSchema,
        response: {
          200: getWorkoutDayResponseSchema,
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

      const getWorkoutDayUseCase = makeGetWorkoutDayUseCase()

      const { workoutDay } = await getWorkoutDayUseCase.execute({
        userId: session.user.id,
        workoutDayId: request.params.workoutDayId,
        workoutPlanId: request.params.workoutPlanId,
      })

      return reply.status(200).send({
        workoutDay: {
          ...workoutDay,
          coverImageUrl: workoutDay.coverImageUrl ?? undefined,
          exercises: workoutDay.exercises.map((exercise) => ({
            ...exercise,
          })),
          sessions: workoutDay.workoutSessions.map((session) => ({
            ...session,
            startedAt: dayjs.utc(session.startedAt).format('YYYY-MM-DD'),
            completedAt: session.completedAt
              ? dayjs.utc(session.completedAt).format('YYYY-MM-DD')
              : undefined,
          })),
        },
      })
    }
  )
}
