import { getHomeData } from "@/lib/api/fetch-generated"
import { Chat } from "../../_components/chat"
import dayjs from "dayjs"
import { redirect } from "next/navigation"

export default async function Page() {
  const today = dayjs().format("YYYY-MM-DD")

  const { data, status } = await getHomeData({ date: today })

  if (status !== 200) return

  if (data.activeWorkoutPlanId) return redirect("/")

  return <Chat embedded />
}
