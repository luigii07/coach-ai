import { prisma } from '@/lib/prisma'

import { UserUpdateInput } from '../../../generated/prisma/models'
import { UsersRepository } from '../users-repository'

export class PrismaUsersRepository implements UsersRepository {
  async findById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    return user
  }

  async update({ userId, data }: { userId: string; data: UserUpdateInput }) {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        weightInGrams: data.weightInGrams,
        heightInCentimeters: data.heightInCentimeters,
        age: data.age,
        bodyFatPercentage: data.bodyFatPercentage,
      },
    })

    return user
  }
}
