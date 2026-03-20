import { z } from 'zod'

import { WeekDay } from '../../generated/prisma/enums'

export const getUserProfileToolSchema = z.object({})

export const updateUserTrainingMetricsToolSchema = z.object({
  weightInGrams: z
    .number()
    .describe('Peso do usuário em gramas (ex: 70kg = 70000)'),
  heightInCentimeters: z.number().describe('Altura do usuário em centímetros'),
  age: z.number().describe('Idade do usuário'),
  bodyFatPercentage: z
    .number()
    .int()
    .min(0)
    .max(100)
    .describe('Percentual de gordura corporal (0 a 100)'),
})

export const fetchWorkoutPlansToolSchema = z.object({})

export const createWorkoutPlanToolSchema = z.object({
  name: z.string().describe('Nome do plano de treino'),
  workoutDays: z
    .array(
      z.object({
        name: z
          .string()
          .describe('Nome do dia (ex: Peito e Tríceps, Descanso)'),
        weekDay: z.enum(WeekDay).describe('Dia da semana'),
        isRest: z
          .boolean()
          .describe('Se é dia de descanso (true) ou treino (false)'),
        estimatedDurationInSeconds: z
          .number()
          .describe('Duração estimada em segundos (0 para dias de descanso)'),
        coverImageUrl: z
          .string()
          .url()
          .describe(
            'URL da imagem de capa do dia de treino. Usar as URLs de superior ou inferior conforme o foco muscular do dia.'
          ),
        exercises: z
          .array(
            z.object({
              order: z.number().describe('Ordem do exercício no dia'),
              name: z.string().describe('Nome do exercício'),
              sets: z.number().describe('Número de séries'),
              reps: z.number().describe('Número de repetições'),
              restTimeInSeconds: z
                .number()
                .describe('Tempo de descanso entre séries em segundos'),
            })
          )
          .describe('Lista de exercícios (vazia para dias de descanso)'),
      })
    )
    .describe('Array com exatamente 7 dias de treino (MONDAY a SUNDAY)'),
})
