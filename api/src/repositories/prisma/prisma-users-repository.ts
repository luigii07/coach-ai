import { prisma } from '@/lib/prisma'

import { UsersRepository } from '../users-repository'

export class PrismaUsersRepository implements UsersRepository {
  async findById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    return user
  }
}
