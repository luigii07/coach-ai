import { z } from "zod"

export const chatFormSchema = z.object({
  message: z.string().min(1),
})

export type ChatFormSchema = z.infer<typeof chatFormSchema>
