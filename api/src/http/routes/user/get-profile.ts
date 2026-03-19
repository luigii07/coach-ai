import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

import { verifyAuthentication } from '@/http/middlewares/verify-authentication'
import { errorSchema } from '@/schemas/error'
import { getUserProfileResponseSchema } from '@/schemas/user'
import { UnauthorizedError } from '@/use-cases/erros/unauthorized-error'
import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-get-user-profile-use-case'

export const getProfile: FastifyPluginAsyncZod = async (app) => {
  app.register(verifyAuthentication)

  app.get(
    '/me',
    {
      schema: {
        tags: ['User'],
        summary: 'Get user profile',
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

      const getUserProfileUseCase = makeGetUserProfileUseCase()

      const { user } = await getUserProfileUseCase.execute({
        userId: session.user.id,
      })

      return reply.status(200).send({
        user,
      })
    }
  )
}
