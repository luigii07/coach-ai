"use client"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Chat } from "./chat"
import { Sparkles } from "lucide-react"
import { parseAsBoolean, useQueryStates } from "nuqs"

export function OpenChatButton() {
  const [chatParams, setChatParams] = useQueryStates({
    chat_open: parseAsBoolean.withDefault(false),
  })

  return (
    <>
      {chatParams.chat_open && (
        <div className="fixed inset-0 bg-foreground/30" />
      )}
      <Popover
        open={chatParams.chat_open}
        onOpenChange={() => setChatParams({ chat_open: !chatParams.chat_open })}
      >
        <PopoverTrigger asChild>
          <button className="rounded-full bg-primary p-4">
            <Sparkles className="size-6 text-primary-foreground" />
          </button>
        </PopoverTrigger>

        <PopoverContent
          sideOffset={-56}
          className="h-[calc(100dvh-180px)] w-[min(1120px,calc(100vw-2rem))] p-0"
        >
          <Chat onClose={() => setChatParams({ chat_open: false })} />
        </PopoverContent>
      </Popover>
    </>
  )
}
