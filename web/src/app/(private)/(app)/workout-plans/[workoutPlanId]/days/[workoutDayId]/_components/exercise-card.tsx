"use client"

import { CircleHelp, Zap } from "lucide-react"
import { useQueryStates, parseAsBoolean, parseAsString } from "nuqs"
import { Button } from "@/components/ui/button"
import type { GetWorkoutDay200WorkoutDayExercisesItem } from "@/lib/api/fetch-generated"

interface ExerciseCardProps {
  exercise: GetWorkoutDay200WorkoutDayExercisesItem
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  const [, setChatParams] = useQueryStates({
    chat_open: parseAsBoolean.withDefault(false),
    chat_initial_message: parseAsString,
  })

  const handleHelp = () => {
    setChatParams({
      chat_open: true,
      chat_initial_message: `Como executar o exercício ${exercise.name} corretamente?`,
    })
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border p-5">
      <div className="flex items-center justify-between">
        <span className="font-heading text-base font-semibold text-foreground">
          {exercise.name}
        </span>
        <Button variant="ghost" size="icon" onClick={handleHelp}>
          <CircleHelp className="size-5 text-muted-foreground" />
        </Button>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="rounded-full bg-muted px-2.5 py-1 font-heading text-xs font-semibold text-muted-foreground uppercase">
          {exercise.sets} séries
        </span>
        <span className="rounded-full bg-muted px-2.5 py-1 font-heading text-xs font-semibold text-muted-foreground uppercase">
          {exercise.reps} reps
        </span>
        <span className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 font-heading text-xs font-semibold text-muted-foreground uppercase">
          <Zap className="size-3.5" />
          {exercise.restTimeInSeconds}s
        </span>
      </div>
    </div>
  )
}
