import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number({ message: 'Invalid port number' }).default(3333),
})

const envSafe = envSchema.safeParse(process.env)

if (!envSafe.success) {
  console.log(
    '🚨 Error in environment variables:',
    envSafe.error.issues[0].message
  )
  process.exit(1)
}

export const env = envSafe.data
