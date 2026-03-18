import { prisma } from '@/lib/prisma'

import {
  WorkoutPlansRepository,
  WorkoutPlanWithDaysAndExercises,
  WorkoutPlanWithDaysAndExercisesCreateInput,
} from '../workout-plans-repostiory'

export class PrismaWorkoutPlansRepository implements WorkoutPlansRepository {
  async createAsAcitive(data: WorkoutPlanWithDaysAndExercisesCreateInput) {
    const workoutPlanActive = await prisma.workoutPlan.findFirst({
      where: {
        isActive: true,
      },
    })

    const { workoutPlan } = await prisma.$transaction(async (tx) => {
      if (workoutPlanActive) {
        await tx.workoutPlan.update({
          where: { id: workoutPlanActive.id },
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

  async findById(
    workoutPlanId: string
  ): Promise<WorkoutPlanWithDaysAndExercises | null> {
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
}
