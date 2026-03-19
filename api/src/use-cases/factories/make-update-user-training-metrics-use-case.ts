import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

import { UpdateUserTrainingMetricsUseCase } from '../update-user-training-metrics-use-case'

export function makeUpdateUserTrainingMetricsUseCase() {
  return new UpdateUserTrainingMetricsUseCase(new PrismaUsersRepository())
}
