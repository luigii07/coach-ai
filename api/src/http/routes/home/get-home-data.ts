import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

import { verifyAuthentication } from '@/http/middlewares/verify-authentication'
import { errorSchema } from '@/schemas/error'
import {
  getHomeDataQuerySchema,
  getHomeDataResponseSchema,
} from '@/schemas/home'
import { UnauthorizedError } from '@/use-cases/erros/unauthorized-error'
import { makeGetHomeDataUseCase } from '@/use-cases/factories/make-get-home-data-use-case'

export const getHomeData: FastifyPluginAsyncZod = async (app) => {
  app.register(verifyAuthentication)

  app.get(
    '/',
    {
      schema: {
        operationId: 'getHomeData',
        tags: ['Home'],
        summary: 'Get home data',
        querystring: getHomeDataQuerySchema,
        response: {
          200: getHomeDataResponseSchema,
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

      const getHomeDataUseCase = makeGetHomeDataUseCase()

      const homeData = await getHomeDataUseCase.execute({
        userId: session.user.id,
        date: request.query.date,
      })

      return reply.status(200).send(homeData)
    }
  )
}
