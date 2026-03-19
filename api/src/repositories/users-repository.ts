import { User } from '../../generated/prisma/client'
import { UserUpdateInput } from '../../generated/prisma/models'

export interface UsersRepository {
  findById(userId: string): Promise<User | null>
  update({
    userId,
    data,
  }: {
    userId: string
    data: UserUpdateInput
  }): Promise<User>
}
