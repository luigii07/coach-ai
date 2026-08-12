import { redirect } from "next/navigation"
import {
  getWorkoutPlanStats,
  getHomeData,
  getUserProfile,
} from "@/lib/api/fetch-generated"
import dayjs from "dayjs"
import { CircleCheck, CirclePercent, Hourglass } from "lucide-react"
import { StreakBanner } from "./_components/streak-banner"
import { StatsHeatmap } from "./_components/stats-heatmap"
import { StatCard } from "./_components/stat-card"

function formatTotalTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  return `${hours}h${minutes.toString().padStart(2, "0")}m`
}

export default async function StatsPage() {
  const today = dayjs()
  const from = today.subtract(2, "month").startOf("month").format("YYYY-MM-DD")
  const to = today.endOf("month").format("YYYY-MM-DD")

  const homeData = await getHomeData({ date: today.format("YYYY-MM-DD") })

  if (homeData.status !== 200) {
    throw new Error("Failed to fetch stats")
  }

  const [statsResponse, trainData] = await Promise.all([
    getWorkoutPlanStats(homeData.data.activeWorkoutPlanId, { from, to }),
    getUserProfile(),
  ])

  const needsOnboarding =
    (homeData.status === 200 && !homeData.data.activeWorkoutPlanId) ||
    (trainData.status === 200 && !trainData.data)
  if (needsOnboarding) redirect("/onboarding")

  if (statsResponse.status !== 200) {
    throw new Error("Failed to fetch stats")
  }

  const {
    workoutStreak,
    consistencyByDay,
    completedWorkoutsCount,
    conclusionRate,
    totalTimeInSeconds,
  } = statsResponse.data

  return (
    <div className="flex min-h-svh flex-col bg-background pb-24">
      <div className="flex h-14 items-center px-5">
        <p
          className="text-[22px] leading-[1.15] text-foreground uppercase"
          style={{ fontFamily: "var(--font-anton)" }}
        >
          Coach.AI
        </p>
      </div>

      <div className="px-5">
        <StreakBanner workoutStreak={workoutStreak} />
      </div>

      <div className="flex flex-col gap-3 p-5">
        <h2 className="font-heading text-lg font-semibold text-foreground">
          Consistência
        </h2>

        <StatsHeatmap consistencyByDay={consistencyByDay} today={today} />

        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={CircleCheck}
            value={String(completedWorkoutsCount)}
            label="Treinos Feitos"
          />
          <StatCard
            icon={CirclePercent}
            value={`${Math.round(conclusionRate * 100)}%`}
            label="Taxa de conclusão"
          />
        </div>

        <StatCard
          icon={Hourglass}
          value={formatTotalTime(totalTimeInSeconds)}
          label="Tempo Total"
        />
      </div>
    </div>
  )
}
