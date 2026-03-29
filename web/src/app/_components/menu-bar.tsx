import Link from "next/link"
import { House, ChartNoAxesColumn, UserRound, Dumbbell } from "lucide-react"
import { OpenChatButton } from "./open-chat-button"

export function MenuBar() {
  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 flex items-center justify-center gap-6 rounded-t-3xl border border-border bg-background px-6 py-4">
      <Link href="/" className="p-3">
        <House className="size-6 text-foreground" />
      </Link>
      <button className="p-3">
        <Dumbbell className="size-6 text-foreground" />
      </button>

      <OpenChatButton />

      <button className="p-3">
        <ChartNoAxesColumn className="size-6 text-foreground" />
      </button>
      <button className="p-3">
        <UserRound className="size-6 text-foreground" />
      </button>
    </nav>
  )
}
