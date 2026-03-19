import { WorkoutDaysRepository } from '@/repositories/workout-days-repository'
import { WorkoutPlansRepository } from '@/repositories/workout-plans-repository'
import { WorkoutSessionsRepository } from '@/repositories/workout-sessions-repository'

import { ResourceNotFoundError } from './erros/resource-not-found-error'
import { SessionAlreadyCompletedError } from './erros/session-already-completed-error'

interface CompleteWorkoutSessionUseCaseRequest {
  userId: string
  workoutPlanId: string
  workoutDayId: string
  sessionId: string
  completedAt: string
}

interface CompleteWorkoutSessionUseCaseResponse {
  id: string
  startedAt: string
  completedAt: string
}

export class CompleteWorkoutSessionUseCase {
  constructor(
    private workoutPlansRespository: WorkoutPlansRepository,
    private workoutDaysRespository: WorkoutDaysRepository,
    private workoutSessionsRepository: WorkoutSessionsRepository
  ) {}

  async execute({
    userId,
    workoutPlanId,
    workoutDayId,
    sessionId,
    completedAt,
  }: CompleteWorkoutSessionUseCaseRequest): Promise<CompleteWorkoutSessionUseCaseResponse> {
    const workoutPlan =
      await this.workoutPlansRespository.findById(workoutPlanId)

    if (!workoutPlan || workoutPlan.userId !== userId) {
      throw new ResourceNotFoundError('Workout plan not found.')
    }

    const workoutDay = await this.workoutDaysRespository.findByPlanAndDayId({
      workoutPlanId,
      workoutDayId,
    })

    if (!workoutDay) {
      throw new ResourceNotFoundError('Workout day not found.')
    }

    const session = await this.workoutSessionsRepository.findById(sessionId)

    if (!session || session.workoutDayId !== workoutDay.id) {
      throw new ResourceNotFoundError('Workout session not found')
    }

    if (session.completedAt) {
      throw new SessionAlreadyCompletedError()
    }

    const updatedSession = await this.workoutSessionsRepository.update({
      sessionId,
      completedAt: new Date(completedAt),
    })

    return {
      id: updatedSession.id,
      startedAt: updatedSession.startedAt.toISOString(),
      completedAt: updatedSession.completedAt!.toISOString(),
    }
  }
}
