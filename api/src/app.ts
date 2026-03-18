import { fastifyCors } from '@fastify/cors'
import { fastifySwagger } from '@fastify/swagger'
import ScalarApiReference from '@scalar/fastify-api-reference'
import { fastify } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { env } from './env'
import { errorHandler } from './http/error-handler'
import { authRoutes } from './http/routes/auth/auth'
import { createWorkoutPlan } from './http/routes/workout-plan/create-workout-plan'
import { getWorkoutPlan } from './http/routes/workout-plan/get-workout-plan'

export const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.setErrorHandler(errorHandler)

app.register(fastifyCors, {
  origin: [env.CLIENT_ORIGIN_URL],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
})

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'FIT AI API',
      description:
        'RESTful API for AI-powered workout planning with chatbot integration.',
      version: '1.0.0',
    },
    servers: [
      {
        description: 'Local development server',
        url: env.API_BASE_URL,
      },
    ],
  },
  transform: jsonSchemaTransform,
})

app.register(ScalarApiReference, {
  routePrefix: '/docs',
  configuration: {
    sources: [
      {
        title: 'Coach API',
        slug: 'coach-api',
        url: '/swagger.json',
      },
      {
        title: 'Auth API',
        slug: 'auth-api',
        url: '/api/auth/open-api/generate-schema',
      },
    ],
  },
})

app.get(
  '/swagger.json',
  {
    schema: {
      hide: true,
    },
  },
  async () => {
    return app.swagger()
  }
)

app.register(authRoutes)

app.register(createWorkoutPlan, { prefix: 'workout-plans' })
app.register(getWorkoutPlan, { prefix: 'workout-plans' })
