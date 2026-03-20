import { google } from '@ai-sdk/google'
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
  UIMessage,
} from 'ai'
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

import { verifyAuthentication } from '@/http/middlewares/verify-authentication'
import { COACH_CHAT_SYSTEM_PROMPT } from '@/prompts/coach'
import {
  createWorkoutPlanToolSchema,
  fetchWorkoutPlansToolSchema,
  getUserProfileToolSchema,
  updateUserTrainingMetricsToolSchema,
} from '@/schemas/ai'
import { UnauthorizedError } from '@/use-cases/erros/unauthorized-error'
import { makeCreateWorkoutPlanUseCase } from '@/use-cases/factories/make-create-workout-plan-use-case'
import { makeFetchWorkoutPlansUseCase } from '@/use-cases/factories/make-fetch-workout-plans-use-case'
import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-get-user-profile-use-case'
import { makeUpdateUserTrainingMetricsUseCase } from '@/use-cases/factories/make-update-user-training-metrics-use-case'

export const aiChatBot: FastifyPluginAsyncZod = async (app) => {
  app.register(verifyAuthentication)

  app.post(
    '/',
    {
      schema: {
        tags: ['AI'],
        summary: 'Chat with AI personal trainer',
      },
    },
    async (request, reply) => {
      const session = request.session
      const userId = session?.user.id

      if (!userId) {
        throw new UnauthorizedError()
      }

      const { messages } = (await request.body) as { messages: UIMessage[] }

      const result = streamText({
        model: google('gemini-2.5-flash'),
        messages: await convertToModelMessages(messages),
        system: COACH_CHAT_SYSTEM_PROMPT,
        stopWhen: stepCountIs(10),
        tools: {
          getUserProfile: tool({
            description:
              'Busca os dados de treino do usuário autenticado (peso, altura, idade, % gordura). Retorna null se não houver dados cadastrados.',
            inputSchema: getUserProfileToolSchema,
            execute: async () => {
              const getUserProfileUseCase = makeGetUserProfileUseCase()

              return getUserProfileUseCase.execute({
                userId,
              })
            },
          }),
          updateUserTrainingMetrics: tool({
            description:
              'Atualiza os dados de treino do usuário autenticado. O peso deve ser em gramas (converter kg * 1000).',
            inputSchema: updateUserTrainingMetricsToolSchema,
            execute: async ({
              age,
              weightInGrams,
              bodyFatPercentage,
              heightInCentimeters,
            }) => {
              const updateUserTrainingMetricsUseCase =
                makeUpdateUserTrainingMetricsUseCase()

              return updateUserTrainingMetricsUseCase.execute({
                userId,
                age,
                weightInGrams,
                bodyFatPercentage,
                heightInCentimeters,
              })
            },
          }),
          fetchWorkoutPlans: tool({
            description:
              'Lista todos os planos de treino do usuário autenticado.',
            inputSchema: fetchWorkoutPlansToolSchema,
            execute: async () => {
              const fetchWorkoutPlansUseCase = makeFetchWorkoutPlansUseCase()

              return fetchWorkoutPlansUseCase.execute({
                userId,
              })
            },
          }),
          createWorkoutPlan: tool({
            description:
              'Cria um novo plano de treino completo para o usuário.',
            inputSchema: createWorkoutPlanToolSchema,
            execute: async ({ name, workoutDays }) => {
              const createWorkoutPlanUseCase = makeCreateWorkoutPlanUseCase()

              return createWorkoutPlanUseCase.execute({
                userId,
                name,
                workoutDays,
              })
            },
          }),
        },
      })

      const response = result.toUIMessageStreamResponse()
      reply.status(response.status)
      response.headers.forEach((value, key) => reply.header(key, value))
      return reply.send(response.body)
    }
  )
}
