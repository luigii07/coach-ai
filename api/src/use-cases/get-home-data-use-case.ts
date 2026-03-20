import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'

import { WorkoutPlansRepository } from '@/repositories/workout-plans-repository'
import { WorkoutSessionsRepository } from '@/repositories/workout-sessions-repository'

import { WeekDay } from '../../generated/prisma/enums'
import { ResourceNotFoundError } from './erros/resource-not-found-error'

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

interface GetHomeDataUseCaseRequest {
  userId: string
  date: string
}

interface GetHomeDataUseCaseResponse {
  activeWorkoutPlanId: string
  todayWorkoutDay: {
    workoutPlanId: string
    id: string
    name: string
    isRest: boolean
    weekDay: WeekDay
    estimatedDurationInSeconds: number
    coverImageUrl?: string
    exercisesCount: number
  }
  workoutStreak: number
  consistencyByDay: Record<
    string,
    {
      workoutDayCompleted: boolean
      workoutDayStarted: boolean
    }
  >
}

export class GetHomeDataUseCase {
  constructor(
    private workoutPlansRepository: WorkoutPlansRepository,
    private workoutSessionsRepository: WorkoutSessionsRepository
  ) {}

  async execute({
    userId,
    date,
  }: GetHomeDataUseCaseRequest): Promise<GetHomeDataUseCaseResponse> {
    const currentDate = dayjs.utc(date)

    const workoutPlan =
      await this.workoutPlansRepository.findActiveByUserIdWithDaysExercisesAndSessions(
        userId
      )

    if (!workoutPlan) {
      throw new ResourceNotFoundError('Active workout plan not found.')
    }

    const todayWeekDay = WEEKDAY_MAP[currentDate.day()]
    const todayWorkoutDay = workoutPlan.workoutDays.find(
      (day) => day.weekDay === todayWeekDay
    )

    if (!todayWorkoutDay) {
      throw new ResourceNotFoundError('No workout day found for today.')
    }

    const weekStart = currentDate.day(0).startOf('day')
    const weekEnd = currentDate.day(6).endOf('day')

    const weekSessions =
      await this.workoutSessionsRepository.findManyByPlanIdStartedBetween({
        workoutPlanId: workoutPlan.id,
        startDate: weekStart.toDate(),
        endDate: weekEnd.toDate(),
      })

    const consistencyByDay: Record<
      string,
      { workoutDayCompleted: boolean; workoutDayStarted: boolean }
    > = {}

    for (let i = 0; i < 7; i++) {
      const day = weekStart.add(i, 'day')
      const dateKey = day.format('YYYY-MM-DD')

      const daySessions = weekSessions.filter(
        (session) =>
          dayjs.utc(session.startedAt).format('YYYY-MM-DD') === dateKey
      )

      const workoutDayStarted = daySessions.length > 0
      const workoutDayCompleted = daySessions.some(
        (session) => session.completedAt !== null
      )

      consistencyByDay[dateKey] = { workoutDayCompleted, workoutDayStarted }
    }

    const workoutStreak = await this.calculateStreak(
      workoutPlan.id,
      workoutPlan.workoutDays.map((day) => ({
        weekDay: day.weekDay,
        isRest: day.isRest,
      })),
      currentDate
    )

    return {
      activeWorkoutPlanId: workoutPlan.id,
      todayWorkoutDay: {
        workoutPlanId: workoutPlan.id,
        id: todayWorkoutDay.id,
        name: todayWorkoutDay.name,
        isRest: todayWorkoutDay.isRest,
        weekDay: todayWorkoutDay.weekDay,
        estimatedDurationInSeconds: todayWorkoutDay.estimatedDurationInSeconds,
        coverImageUrl: todayWorkoutDay.coverImageUrl ?? undefined,
        exercisesCount: todayWorkoutDay.exercises.length,
      },
      workoutStreak,
      consistencyByDay,
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
    const planWeekDays = new Set(workoutDays.map((day) => day.weekDay))
    const restWeekDays = new Set(
      workoutDays.filter((day) => day.isRest).map((day) => day.weekDay)
    )

    const completedSessions =
      await this.workoutSessionsRepository.findManyCompletedByPlanId(
        workoutPlanId
      )

    const completedDates = new Set(
      completedSessions.map((session) =>
        dayjs.utc(session.startedAt).format('YYYY-MM-DD')
      )
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
