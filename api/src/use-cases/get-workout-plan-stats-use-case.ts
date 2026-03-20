import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'

import { WorkoutPlansRepository } from '@/repositories/workout-plans-repository'
import { WorkoutSessionsRepository } from '@/repositories/workout-sessions-repository'

import { WeekDay } from '../../generated/prisma/enums'
import { ResourceNotFoundError } from './erros/resource-not-found-error'
import { WorkoutPlanNotActiveError } from './erros/workout-plan-not-active-error'

dayjs.extend(utc)

const WEEKDAY_MAP: Record<number, WeekDay> = {
  0: WeekDay.SUNDAY,
  1: WeekDay.MONDAY,
  2: WeekDay.TUESDAY,
  3: WeekDay.WEDNESDAY,
  4: WeekDay.THURSDAY,
  5: WeekDay.FRIDAY,
  6: WeekDay.SATURDAY,
}

interface GetWorkoutPlanStatsUseCaseRequest {
  userId: string
  workoutPlanId: string
  from: string
  to: string
}

interface GetWorkoutPlanStatsUseCaseResponse {
  workoutStreak: number
  consistencyByDay: Record<
    string,
    {
      workoutDayCompleted: boolean
      workoutDayStarted: boolean
    }
  >
  completedWorkoutsCount: number
  conclusionRate: number
  totalTimeInSeconds: number
}

export class GetWorkoutPlanStatsUseCase {
  constructor(
    private workoutPlansRepository: WorkoutPlansRepository,
    private workoutSessionsRepository: WorkoutSessionsRepository
  ) {}

  async execute({
    userId,
    workoutPlanId,
    from,
    to,
  }: GetWorkoutPlanStatsUseCaseRequest): Promise<GetWorkoutPlanStatsUseCaseResponse> {
    const fromDate = dayjs.utc(from).startOf('day')
    const toDate = dayjs.utc(to).endOf('day')

    const workoutPlan =
      await this.workoutPlansRepository.findByIdWithDaysAndExercises(
        workoutPlanId
      )

    if (!workoutPlan || workoutPlan.userId !== userId) {
      throw new ResourceNotFoundError('Workout plan not found.')
    }

    if (!workoutPlan.isActive) {
      throw new WorkoutPlanNotActiveError()
    }

    const sessions =
      await this.workoutSessionsRepository.findManyByPlanIdStartedBetween({
        workoutPlanId,
        startDate: fromDate.toDate(),
        endDate: toDate.toDate(),
      })

    const consistencyByDay: Record<
      string,
      { workoutDayCompleted: boolean; workoutDayStarted: boolean }
    > = {}

    sessions.forEach((session) => {
      const dateKey = dayjs.utc(session.startedAt).format('YYYY-MM-DD')

      if (!consistencyByDay[dateKey]) {
        consistencyByDay[dateKey] = {
          workoutDayCompleted: false,
          workoutDayStarted: false,
        }
      }

      consistencyByDay[dateKey].workoutDayStarted = true

      if (session.completedAt !== null) {
        consistencyByDay[dateKey].workoutDayCompleted = true
      }
    })

    const completedSessions = sessions.filter((s) => s.completedAt !== null)

    const completedWorkoutsCount = completedSessions.length
    const conclusionRate =
      sessions.length > 0 ? completedWorkoutsCount / sessions.length : 0

    const totalTimeInSeconds = completedSessions.reduce((total, session) => {
      const start = dayjs.utc(session.startedAt)
      const end = dayjs.utc(session.completedAt!)
      return total + end.diff(start, 'second')
    }, 0)

    const workoutStreak = await this.calculateStreak(
      workoutPlanId,
      workoutPlan.workoutDays.map((day) => ({
        weekDay: day.weekDay,
        isRest: day.isRest,
      })),
      toDate
    )

    return {
      workoutStreak,
      consistencyByDay,
      completedWorkoutsCount,
      conclusionRate,
      totalTimeInSeconds,
    }
  }

  private async calculateStreak(
    workoutPlanId: string,
    workoutDays: Array<{
      weekDay: WeekDay
      isRest: boolean
    }>,
    currentDate: dayjs.Dayjs
  ): Promise<number> {
    const planWeekDays = new Set(workoutDays.map((d) => d.weekDay))
    const restWeekDays = new Set(
      workoutDays.filter((d) => d.isRest).map((d) => d.weekDay)
    )

    const completedSessions =
      await this.workoutSessionsRepository.findManyCompletedByPlanId(
        workoutPlanId
      )

    const completedDates = new Set(
      completedSessions.map((s) => dayjs.utc(s.startedAt).format('YYYY-MM-DD'))
    )

    let streak = 0
    let day = currentDate

    for (let i = 0; i < 365; i++) {
      const weekDay = WEEKDAY_MAP[day.day()]

      if (!planWeekDays.has(weekDay)) {
        day = day.subtract(1, 'day')
        continue
      }

      if (restWeekDays.has(weekDay)) {
        streak++
        day = day.subtract(1, 'day')
        continue
      }

      const dateKey = day.format('YYYY-MM-DD')
      if (completedDates.has(dateKey)) {
        streak++
        day = day.subtract(1, 'day')
        continue
      }

      break
    }

    return streak
  }
}
