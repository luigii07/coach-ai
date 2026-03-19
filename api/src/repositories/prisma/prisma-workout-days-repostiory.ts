import { prisma } from '@/lib/prisma'

import { WorkoutDaysRepository } from '../workout-days-repository'

export class PrismaWorkoutDaysRepository implements WorkoutDaysRepository {
  async findByPlanAndDayId({
    workoutDayId,
    workoutPlanId,
  }: {
    workoutDayId: string
    workoutPlanId: string
  }) {
    const workoutDay = await prisma.workoutDay.findUnique({
      where: {
        id: workoutDayId,
        workoutPlanId,
      },
      include: {
        exercises: { orderBy: { order: 'asc' } },
        workoutSessions: true,
      },
    })

    return workoutDay
  }
}
