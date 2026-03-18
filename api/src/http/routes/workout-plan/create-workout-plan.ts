import { fromNodeHeaders } from 'better-auth/node'
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

import { auth } from '@/lib/auth'
import { errorSchema } from '@/schemas/error'
import {
  createWorkoutPlanBodySchema,
  workoutPlanResponseSchema,
} from '@/schemas/workout-plans'
import { UnauthorizedError } from '@/use-cases/erros/unauthorized-error'
import { makeCreateWorkoutPlanUseCase } from '@/use-cases/factories/make-create-workout-plan-use-case'

export const createWorkoutPlan: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/',
    {
      schema: {
        tags: ['Workout Plan'],
        summary: 'Create a workout plan',
        body: createWorkoutPlanBodySchema,
        response: {
          201: workoutPlanResponseSchema,
          401: errorSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const session = await auth.api.getSession({
          headers: fromNodeHeaders(request.headers),
        })

        if (!session) {
          throw new UnauthorizedError()
        }

        const createWorkoutPlanUseCase = makeCreateWorkoutPlanUseCase()

        const workoutPlan = await createWorkoutPlanUseCase.execute({
          name: request.body.name,
          userId: session.user.id,
          workoutDays: request.body.workoutDays,
        })

        return reply.status(201).send({
          workoutPlan,
        })
      } catch (error) {
        if (error instanceof UnauthorizedError) {
          return reply
            .status(401)
            .send({ error: 'Unauthorized', code: 'UNAUTHORIZED' })
        }

        console.log(error)
      }
    }
  )
}
