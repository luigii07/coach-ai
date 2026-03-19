import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

import { GetUserProfileUseCase } from '../get-user-profile-use-case'

export function makeGetUserProfileUseCase() {
  return new GetUserProfileUseCase(new PrismaUsersRepository())
}
