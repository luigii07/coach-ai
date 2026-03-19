import dayjs from 'dayjs'

import { prisma } from '@/lib/prisma'

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
}
