import { House, ChartNoAxesColumn, UserRound, Dumbbell } from "lucide-react"
import { OpenChatButton } from "./open-chat-button"
import { getHomeData } from "@/lib/api/fetch-generated"
import dayjs from "dayjs"
import { MenuBarItem } from "./menu-bar-item"

export async function MenuBar() {
  const today = dayjs()
  const homeData = await getHomeData({ date: today.format("YYYY-MM-DD") })

  if (homeData.status !== 200) return

  const { activeWorkoutPlanId } = homeData.data

  const workoutPlansHref =
    homeData.status === 200 && activeWorkoutPlanId
      ? `/workout-plans/${activeWorkoutPlanId}`
      : null

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 flex items-center justify-center gap-6 rounded-t-3xl border border-border bg-background px-6 py-4">
      <MenuBarItem href="/">
        <House className="size-6" />
      </MenuBarItem>

      {workoutPlansHref && (
        <MenuBarItem href={workoutPlansHref}>
          <Dumbbell className="size-6" />
        </MenuBarItem>
      )}

      <OpenChatButton />

      <MenuBarItem href="/stats">
        <ChartNoAxesColumn className="size-6" />
      </MenuBarItem>

      <MenuBarItem href="/profile">
        <UserRound className="size-6" />
      </MenuBarItem>
    </nav>
  )
}
