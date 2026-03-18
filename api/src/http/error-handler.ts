import { FastifyInstance } from 'fastify'
import { hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod'

import { ResourceNotFoundError } from '@/use-cases/erros/resource-not-found-error'
import { UnauthorizedError } from '@/use-cases/erros/unauthorized-error'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      message: error.message,
      code: 'VALIDATION_ERROR',
    })
  }

  if (error instanceof UnauthorizedError) {
    return reply.status(401).send({
      message: error.message,
      code: 'UNAUTHORIZED_ERROR',
    })
  }

  if (error instanceof ResourceNotFoundError) {
    return reply.status(404).send({
      message: error.message,
      code: 'RESOURCE_NOT_FOUND_ERROR',
    })
  }

  console.log(error)

  return reply.status(500).send({
    message: 'Internal Server Error',
    code: 'INTERNAL_SERVER_ERROR',
  })
}
