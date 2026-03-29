import { Sparkles } from "lucide-react"

export function ThinkingIndicator() {
  return (
    <div className="flex items-start pt-5 pr-16 pl-6">
      <div className="flex items-center gap-2">
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
          <div className="relative flex items-center justify-center">
            <Sparkles className="size-4 animate-pulse text-primary" />
          </div>
        </div>
      </div>
    </div>
  )
}
