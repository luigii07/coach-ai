import { fromNodeHeaders } from 'better-auth/node'
import { fastifyPlugin } from 'fastify-plugin'
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

import { auth } from '@/lib/auth'

export const verifyAuthentication: FastifyPluginAsyncZod = fastifyPlugin(
  async (app) => {
    app.addHook('preHandler', async (request) => {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(request.headers),
      })

      request.session = session
    })
  }
)
