import { WorkoutDaysRepository } from '@/repositories/workout-days-repository'
import { WorkoutPlansRepository } from '@/repositories/workout-plans-repository'
import { WorkoutSessionsRepository } from '@/repositories/workout-sessions-repository'

import { ResourceNotFoundError } from './erros/resource-not-found-error'
import { SessionAlreadyStartedError } from './erros/session-already-started-error'
import { WorkoutPlanNotActiveError } from './erros/workout-plan-not-active-error'

interface StartWorkoutSessionUseCaseRequest {
  userId: string
  workoutPlanId: string
  workoutDayId: string
}

interface StartWorkoutSessionUseCaseResponse {
  userWorkoutSessionId: string
}

export class StartWorkoutSessionUseCase {
  constructor(
    private workoutPlansRespository: WorkoutPlansRepository,
    private workoutDaysRespository: WorkoutDaysRepository,
    private workoutSessionsRepository: WorkoutSessionsRepository
  ) {}

  async execute({
    userId,
    workoutPlanId,
    workoutDayId,
  }: StartWorkoutSessionUseCaseRequest): Promise<StartWorkoutSessionUseCaseResponse> {
    const workoutPlan =
      await this.workoutPlansRespository.findById(workoutPlanId)

    if (!workoutPlan || workoutPlan.userId !== userId) {
      throw new ResourceNotFoundError('Workout plan not found.')
    }

    if (!workoutPlan.isActive) {
      throw new WorkoutPlanNotActiveError()
    }

    const workoutDay = await this.workoutDaysRespository.findByPlanAndDayId({
      workoutPlanId,
      workoutDayId,
    })

    if (!workoutDay) {
      throw new ResourceNotFoundError('Workout day not found.')
    }

    const existingSession =
      await this.workoutSessionsRepository.findByWorkoutDayIdOnDate(
        workoutDay.id,
        new Date()
      )

    if (existingSession) {
      throw new SessionAlreadyStartedError()
    }

    const session = await this.workoutSessionsRepository.create(workoutDay.id)

    return {
      userWorkoutSessionId: session.id,
    }
  }
}
