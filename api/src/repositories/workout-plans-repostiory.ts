import { Prisma } from '../../generated/prisma/client'

export type WorkoutPlanWithDaysAndExercisesCreateInput =
  Prisma.WorkoutPlanGetPayload<{
    select: {
      name: true
      userId: true
      workoutDays: {
        select: {
          name: true
          weekDay: true
          isRest: true
          estimatedDurationInSeconds: true
          coverImageUrl: true
          exercises: {
            select: {
              order: true
              name: true
              sets: true
              reps: true
              restTimeInSeconds: true
            }
          }
        }
      }
    }
  }>

export type WorkoutPlanWithDaysAndExercises = Prisma.WorkoutPlanGetPayload<{
  include: {
    workoutDays: {
      include: {
        exercises: true
      }
    }
  }
}>

export interface WorkoutPlansRepository {
  createAsAcitive(
    data: WorkoutPlanWithDaysAndExercisesCreateInput
  ): Promise<WorkoutPlanWithDaysAndExercises>
}
