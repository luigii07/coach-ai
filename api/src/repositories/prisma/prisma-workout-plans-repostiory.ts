import { prisma } from '@/lib/prisma'

import {
  WorkoutPlansRepository,
  WorkoutPlanWithDaysAndExercisesCreateInput,
} from '../workout-plans-repository'

export class PrismaWorkoutPlansRepository implements WorkoutPlansRepository {
  async createAsAcitive(data: WorkoutPlanWithDaysAndExercisesCreateInput) {
    const workoutPlanActive = await prisma.workoutPlan.findFirst({
      where: {
        userId: data.userId,
        isActive: true,
      },
    })

    const { workoutPlan } = await prisma.$transaction(async (tx) => {
      if (workoutPlanActive) {
        await tx.workoutPlan.update({
          where: {
            id: workoutPlanActive.id,
            userId: data.userId,
          },
          data: { isActive: false },
        })
      }

      const workoutPlan = await tx.workoutPlan.create({
        data: {
          name: data.name,
          userId: data.userId,
          isActive: true,
          workoutDays: {
            create: data.workoutDays.map((workoutDay) => ({
              ...workoutDay,
              exercises: {
                create: workoutDay.exercises.map((exercise) => ({
                  ...exercise,
                })),
              },
            })),
          },
        },
        include: {
          workoutDays: {
            include: {
              exercises: true,
            },
          },
        },
      })

      return { workoutPlan }
    })

    return workoutPlan
  }

  async findByIdWithDaysAndExercises(workoutPlanId: string) {
    const workoutPlan = await prisma.workoutPlan.findUnique({
      where: {
        id: workoutPlanId,
      },
      include: {
        workoutDays: {
          include: {
            exercises: true,
          },
        },
      },
    })

    return workoutPlan
  }

  async findManyByUserId(userId: string, isActive?: boolean) {
    const workoutPlans = await prisma.workoutPlan.findMany({
      where: {
        userId,
        isActive,
      },
      include: {
        workoutDays: {
          include: {
            exercises: true,
          },
        },
      },
    })

    return workoutPlans
  }

  async findById(workoutPlanId: string) {
    const workoutPlan = await prisma.workoutPlan.findUnique({
      where: { id: workoutPlanId },
    })

    return workoutPlan
  }

  async findActiveByUserIdWithDaysExercisesAndSessions(userId: string) {
    const workoutPlan = await prisma.workoutPlan.findFirst({
      where: {
        userId,
        isActive: true,
      },
      include: {
        workoutDays: {
          include: {
            exercises: true,
            workoutSessions: true,
          },
        },
      },
    })

    return workoutPlan
  }
}
