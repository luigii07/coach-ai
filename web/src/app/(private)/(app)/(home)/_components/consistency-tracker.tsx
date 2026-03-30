import dayjs from "dayjs"
import { ConsistencySquare } from "../../../../_components/consistency-square"
import { GetHomeData200ConsistencyByDay } from "@/lib/api/fetch-generated/index.js"

const WEEKDAY_SHORT = ["D", "S", "T", "Q", "Q", "S", "S"]

function getWeekDates(today: dayjs.Dayjs) {
  const sunday = today.day() === 0 ? today : today.subtract(1, "day")

  return Array.from({ length: 7 }, (_, i) => sunday.add(i, "day"))
}

interface ConsistencyTrackerProps {
  consistencyByDay: GetHomeData200ConsistencyByDay
  today: dayjs.Dayjs
}

export function ConsistencyTracker({
  consistencyByDay,
  today,
}: ConsistencyTrackerProps) {
  const weekDates = getWeekDates(today)
  const todayStr = today.format("YYYY-MM-DD")

  return (
    <div className="flex items-center justify-between">
      {weekDates.map((date, index) => {
        const dateStr = date.format("YYYY-MM-DD")
        const dayData = consistencyByDay[dateStr]
        return (
          <div key={dateStr} className="flex flex-col items-center gap-1.5">
            <ConsistencySquare
              completed={dayData?.workoutDayCompleted ?? false}
              started={dayData?.workoutDayStarted ?? false}
              isToday={dateStr === todayStr}
            />
            <span className="font-heading text-xs text-muted-foreground">
              {WEEKDAY_SHORT[index]}
            </span>
          </div>
        )
      })}
    </div>
  )
}
