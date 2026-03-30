import { WEEKDAY_LABELS } from "@/lib/utils"
import { Calendar, Zap } from "lucide-react"

interface RestDayCardProps {
  weekDay: string
}

export function RestDayCard({ weekDay }: RestDayCardProps) {
  return (
    <div className="flex h-[110px] w-full flex-col items-start justify-between rounded-xl bg-muted p-5">
      <div className="flex items-center gap-1 rounded-full bg-foreground/8 px-2.5 py-1.5 backdrop-blur-sm">
        <Calendar className="size-3.5 text-foreground" />
        <span className="font-heading text-xs font-semibold text-foreground uppercase">
          {WEEKDAY_LABELS[weekDay]}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Zap className="size-5 text-foreground" />
        <span className="font-heading text-2xl leading-[1.05] font-semibold text-foreground">
          Descanso
        </span>
      </div>
    </div>
  )
}
