import { redirect } from "next/navigation"
import {
  getWorkoutPlan,
  getHomeData,
  getUserProfile,
} from "@/lib/api/fetch-generated"
import dayjs from "dayjs"
import Image from "next/image"
import Link from "next/link"
import { Goal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { WorkoutDayCard } from "@/app/_components/workout-day-card"
import { RestDayCard } from "../_components/rest-day-card"

const WEEKDAY_ORDER = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
]

export default async function WorkoutPlanPage({
  params,
}: {
  params: Promise<{ workoutPlanId: string }>
}) {
  const { workoutPlanId } = await params
  const [workoutPlanData, homeData, trainData] = await Promise.all([
    getWorkoutPlan(workoutPlanId),
    getHomeData({ date: dayjs().format("YYYY-MM-DD") }),
    getUserProfile(),
  ])

  const needsOnboarding =
    (homeData.status === 200 && !homeData.data.activeWorkoutPlanId) ||
    (trainData.status === 200 && !trainData.data)

  if (needsOnboarding) redirect("/onboarding")

  console.log(workoutPlanData.status)
  if (workoutPlanData.status !== 200) redirect("/")

  const { name, workoutDays } = workoutPlanData.data.workoutPlan

  const sortedDays = [...workoutDays].sort(
    (a, b) =>
      WEEKDAY_ORDER.indexOf(a.weekDay) - WEEKDAY_ORDER.indexOf(b.weekDay)
  )

  return (
    <div className="flex min-h-svh flex-col bg-background pb-24">
      <div className="relative flex h-[296px] shrink-0 flex-col items-start justify-between overflow-hidden rounded-b-[20px] px-5 pt-5 pb-10">
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src="/workout-plan-banner.png"
            alt=""
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(238deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)",
            }}
          />
        </div>

        <p
          className="relative text-[22px] leading-[1.15] text-background uppercase"
          style={{ fontFamily: "var(--font-anton)" }}
        >
          Coach AI
        </p>

        <div className="relative flex w-full items-end justify-between">
          <div className="flex flex-col gap-3">
            <Badge className="gap-1 rounded-full px-2.5 py-1.5 font-heading text-xs font-semibold uppercase">
              <Goal className="size-4" />
              {name}
            </Badge>
            <h1 className="font-heading text-2xl leading-[1.05] font-semibold text-background">
              Plano de Treino
            </h1>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-5">
        {sortedDays.map((day) =>
          day.isRest ? (
            <RestDayCard key={day.id} weekDay={day.weekDay} />
          ) : (
            <Link
              key={day.id}
              href={`/workout-plans/${workoutPlanId}/days/${day.id}`}
            >
              <WorkoutDayCard
                name={day.name}
                weekDay={day.weekDay}
                estimatedDurationInSeconds={day.estimatedDurationInSeconds}
                exercisesCount={day.exercises.length}
                coverImageUrl={day.coverImageUrl}
              />
            </Link>
          )
        )}
      </div>
    </div>
  )
}
