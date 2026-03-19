import dayjs from 'dayjs'

import { prisma } from '@/lib/prisma'

import { WorkoutSession } from '../../../generated/prisma/client'
import { WorkoutSessionsRepository } from '../workout-sessions-repository'

export class PrismaWorkoutSessionsRepository implements WorkoutSessionsRepository {
  async findByWorkoutDayIdOnDate(workoutDayId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const session = await prisma.workoutSession.findFirst({
      where: {
        workoutDayId,
        startedAt: {
          gte: startOfTheDay.toDate(),
          lte: endOfTheDay.toDate(),
        },
      },
    })

    return session
  }

  async create(workoutDayId: string) {
    const session = await prisma.workoutSession.create({
      data: {
        workoutDayId,
        startedAt: new Date(),
      },
    })

    return session
  }

  async findById(sessionId: string) {
    const session = await prisma.workoutSession.findFirst({
      where: { id: sessionId },
    })

    return session
  }

  async update({
    sessionId,
    completedAt,
  }: {
    sessionId: string
    completedAt: Date
  }): Promise<WorkoutSession> {
    const session = await prisma.workoutSession.update({
      where: {
        id: sessionId,
      },
      data: {
        completedAt,
      },
    })

    return session
  }
}
