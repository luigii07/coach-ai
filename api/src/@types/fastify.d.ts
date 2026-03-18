import { auth } from '@/lib/auth'

type Session = typeof auth.$Infer.Session

declare module 'fastify' {
  interface FastifyRequest {
    session: Session | null
  }
}
