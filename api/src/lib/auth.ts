import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { openAPI } from 'better-auth/plugins'

import { env } from '@/env'

import { prisma } from './prisma'

export const auth = betterAuth({
  baseURL: env.API_BASE_URL,
  trustedOrigins: [env.CLIENT_ORIGIN_URL],
  emailAndPassword: {
    enabled: true,
  },
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  plugins: [openAPI()],
})
