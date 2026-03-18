import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number({ message: 'Invalid port number' }).default(3333),
  DATABASE_URL: z.url({ message: 'Invalid database URL' }),
  NODE_ENV: z
    .enum(['production', 'development', 'test'])
    .default('development'),
  BETTER_AUTH_SECRET: z
    .string({ message: 'Invalid better auth secret' })
    .min(32, { message: 'Better auth secret must be at least 32 characters' }),
  API_BASE_URL: z.url({ message: 'Invalid api base URL' }),
  CLIENT_ORIGIN_URL: z.url({ message: 'Invalid client origin URL' }),
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
