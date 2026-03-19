import { User } from '../../generated/prisma/client'

export interface UsersRepository {
  findById(userId: string): Promise<User | null>
}
