import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

import { verifyAuthentication } from '@/http/middlewares/verify-authentication'
import { errorSchema } from '@/schemas/error'
import {
  getUserProfileResponseSchema,
  updateUserTrainingMetricsBodySchema,
} from '@/schemas/user'
import { UnauthorizedError } from '@/use-cases/erros/unauthorized-error'
import { makeUpdateUserTrainingMetricsUseCase } from '@/use-cases/factories/make-update-user-training-metrics-use-case'

export const updateUserTrainingMetrics: FastifyPluginAsyncZod = async (app) => {
  app.register(verifyAuthentication)

  app.put(
    '/',
    {
      schema: {
        tags: ['User'],
        summary: 'Update user training metrics',
        body: updateUserTrainingMetricsBodySchema,
        response: {
          200: getUserProfileResponseSchema,
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

      const updateUserTrainingMetricsUseCase =
        makeUpdateUserTrainingMetricsUseCase()

      const { user } = await updateUserTrainingMetricsUseCase.execute({
        userId: session.user.id,
        age: request.body.age,
        weightInGrams: request.body.weightInGrams,
        bodyFatPercentage: request.body.bodyFatPercentage,
        heightInCentimeters: request.body.heightInCentimeters,
      })

      return reply.status(200).send({
        user,
      })
    }
  )
}
