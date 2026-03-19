import { FastifyInstance } from 'fastify'
import { hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod'

import { ResourceNotFoundError } from '@/use-cases/erros/resource-not-found-error'
import { SessionAlreadyCompletedError } from '@/use-cases/erros/session-already-completed-error'
import { SessionAlreadyStartedError } from '@/use-cases/erros/session-already-started-error'
import { UnauthorizedError } from '@/use-cases/erros/unauthorized-error'
import { WorkoutPlanNotActiveError } from '@/use-cases/erros/workout-plan-not-active-error'

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

  if (error instanceof WorkoutPlanNotActiveError) {
    return reply.status(422).send({
      message: error.message,
      code: 'WORKOUT_PLAN_NOT_ACTIVE_ERROR',
    })
  }

  if (error instanceof SessionAlreadyStartedError) {
    return reply.status(409).send({
      message: error.message,
      code: 'SESSION_ALREADY_STARTED_ERROR',
    })
  }

  if (error instanceof SessionAlreadyCompletedError) {
    return reply.status(409).send({
      message: error.message,
      code: 'SESSION_ALREADY_COMPLETED_ERROR',
    })
  }

  console.log(error)

  return reply.status(500).send({
    message: 'Internal Server Error',
    code: 'INTERNAL_SERVER_ERROR',
  })
}
