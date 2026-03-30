import { Button } from "@/components/ui/button"
import { getWorkoutDay } from "@/lib/api/fetch-generated"
import { WEEKDAY_LABELS, WEEKDAY_TITLE_LABELS } from "@/lib/utils"
import { Calendar, Dumbbell, Timer } from "lucide-react"
import Image from "next/image"
import { redirect } from "next/navigation"
import { BackButton } from "./_components/back-button"
import { StartWorkoutButton } from "./_components/start-workout-session-button"
import { ExerciseCard } from "./_components/exercise-card"
import { CompleteWorkoutButton } from "./_components/complete-workout-button"

export default async function WorkoutDayPage({
  params,
}: {
  params: Promise<{ workoutPlanId: string; workoutDayId: string }>
}) {
  const { workoutPlanId, workoutDayId } = await params
  const workoutDayData = await getWorkoutDay(workoutPlanId, workoutDayId)

  if (workoutDayData.status !== 200) redirect("/")

  const {
    name,
    weekDay,
    estimatedDurationInSeconds,
    exercises,
    sessions,
    coverImageUrl,
  } = workoutDayData.data.workoutDay

  const durationInMinutes = Math.round(estimatedDurationInSeconds / 60)

  const inProgressSession = sessions.find((s) => s.startedAt && !s.completedAt)
  const completedSession = sessions.find((s) => s.completedAt)
  const hasInProgressSession = !!inProgressSession
  const hasCompletedSession = !!completedSession

  return (
    <div className="flex min-h-svh flex-col bg-background pb-24">
      <div className="flex items-center justify-between px-5 py-4">
        <BackButton />
        <h1 className="font-heading text-lg font-semibold text-foreground">
          {hasInProgressSession || hasCompletedSession
            ? "Treino de Hoje"
            : WEEKDAY_TITLE_LABELS[weekDay]}
        </h1>
        <div className="size-6" />
      </div>

      <div className="px-5">
        <div className="relative flex h-[200px] w-full flex-col items-start justify-between overflow-hidden rounded-xl p-5">
          {coverImageUrl && (
            <Image
              src={coverImageUrl}
              alt={name}
              fill
              className="pointer-events-none object-cover"
            />
          )}
          <div className="absolute inset-0 bg-foreground/40" />

          <div className="relative">
            <div className="flex items-center gap-1 rounded-full bg-background/16 px-2.5 py-1.5 backdrop-blur-sm">
              <Calendar className="size-3.5 text-background" />
              <span className="font-heading text-xs font-semibold text-background uppercase">
                {WEEKDAY_LABELS[weekDay]}
              </span>
            </div>
          </div>

          <div className="relative flex w-full items-end justify-between">
            <div className="flex flex-col gap-2">
              <h2 className="font-heading text-2xl leading-[1.05] font-semibold text-background">
                {name}
              </h2>
              <div className="flex items-start gap-2">
                <div className="flex items-center gap-1">
                  <Timer className="size-3.5 text-background/70" />
                  <span className="font-heading text-xs text-background/70">
                    {durationInMinutes}min
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Dumbbell className="size-3.5 text-background/70" />
                  <span className="font-heading text-xs text-background/70">
                    {exercises.length} exercícios
                  </span>
                </div>
              </div>
            </div>

            {!hasInProgressSession && !hasCompletedSession && (
              <StartWorkoutButton
                workoutPlanId={workoutPlanId}
                workoutDayId={workoutDayId}
              />
            )}
            {hasCompletedSession && (
              <Button
                variant="ghost"
                disabled
                className="rounded-full px-4 py-2 font-heading text-sm font-semibold text-background/70 hover:bg-transparent hover:text-background/70"
              >
                Concluído!
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 px-5 pt-5">
        {exercises
          .sort((a, b) => a.order - b.order)
          .map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
      </div>

      {hasInProgressSession && inProgressSession && (
        <div className="px-5 pt-5">
          <CompleteWorkoutButton
            workoutPlanId={workoutPlanId}
            workoutDayId={workoutDayId}
            sessionId={inProgressSession.id}
          />
        </div>
      )}
    </div>
  )
}
