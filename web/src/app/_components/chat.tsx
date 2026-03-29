"use client"

import { Button } from "@/components/ui/button"
import { chatFormSchema, ChatFormSchema } from "@/schemas/chat"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { ArrowUp, Sparkles, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef } from "react"
import { Streamdown } from "streamdown"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { ThinkingIndicator } from "./thinking-indicator"

interface ChatProps {
  embedded?: boolean
  onClose?: () => void
}

export function Chat({ embedded, onClose }: ChatProps) {
  const form = useForm<ChatFormSchema>({
    defaultValues: {
      message: "",
    },
    resolver: zodResolver(chatFormSchema),
  })

  const messageValue = useWatch({
    control: form.control,
    name: "message",
  })

  const { messages, status, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: `${process.env.NEXT_PUBLIC_API_URL}/ai`,
      credentials: "include",
    }),
  })

  const isStreaming = status === "streaming"
  const isLoading = status === "submitted" || isStreaming

  function onSubmit(data: ChatFormSchema) {
    sendMessage({ text: data.message })
    form.setValue("message", "")
  }

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const SUGGESTED_MESSAGES = ["Quero montar um plano de treino"]

  function handleSuggestion(suggestion: string) {
    form.setValue("message", suggestion)
  }

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messagesEndRef])

  return (
    <div
      className={
        embedded
          ? "flex h-svh flex-col bg-background"
          : "flex flex-1 flex-col overflow-hidden rounded-3xl bg-background"
      }
    >
      <div className="flex shrink-0 items-center justify-between border-b border-border p-5">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center rounded-full border border-primary/8 bg-primary/8 p-3">
            <Sparkles className="size-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-base font-semibold text-foreground">
              Coach AI
            </span>
            <div className="flex items-center gap-1">
              <div className="size-2 rounded-full bg-online" />
              <span className="font-heading text-xs text-primary">Online</span>
            </div>
          </div>
        </div>

        {embedded ? (
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">Acessar COACH.AI</Link>
          </Button>
        ) : (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="size-6 text-foreground" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pb-5">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col pt-5 ${
              message.role === "assistant"
                ? "items-start pr-16 pl-5"
                : "items-end pr-5 pl-16"
            } `}
          >
            <div
              className={
                message.role === "assistant"
                  ? "rounded-xl bg-secondary p-3"
                  : "rounded-xl bg-primary p-3"
              }
            >
              {message.role === "assistant" ? (
                message.parts.map((part, index) =>
                  part.type === "text" ? (
                    <Streamdown
                      key={`stream-part-${index}`}
                      isAnimating={
                        isStreaming &&
                        messages[messages.length - 1].id === message.id
                      }
                      className="font-heading text-sm leading-relaxed text-foreground"
                    >
                      {part.text}
                    </Streamdown>
                  ) : null
                )
              ) : (
                <div className="font-heading text-sm leading-relaxed text-primary-foreground">
                  {message.parts
                    .filter((part) => part.type === "text")
                    .map(
                      (part) => (part as { type: "text"; text: string }).text
                    )
                    .join("")}
                </div>
              )}
            </div>
          </div>
        ))}

        {status === "submitted" && <ThinkingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      <div className="flex shrink-0 flex-col gap-3">
        {messages.length === 0 && (
          <div className="flex gap-2.5 overflow-x-auto px-5">
            {SUGGESTED_MESSAGES.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSuggestion(suggestion)}
                className="rounded-full bg-primary/10 px-4 py-2 font-heading text-sm whitespace-nowrap text-foreground"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-center gap-2 border-t border-border p-5"
        >
          <Input
            {...form.register("message")}
            placeholder="Digite sua mensagem..."
            className="h-9 rounded-full border-border bg-secondary px-4 py-3 font-heading text-sm text-foreground placeholder:text-muted-foreground"
          />

          <Button
            type="submit"
            size="icon"
            disabled={!messageValue.trim() || isLoading}
            className="size-10 shrink-0 rounded-full"
          >
            <ArrowUp className="size-5" />
          </Button>
        </form>
      </div>
    </div>
  )
}
