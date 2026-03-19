import { UsersRepository } from '@/repositories/users-repository'

import { User } from '../../generated/prisma/client'
import { ResourceNotFoundError } from './erros/resource-not-found-error'
import { UnauthorizedError } from './erros/unauthorized-error'

interface UpdateUserTrainingMetricsUseCaseRequest {
  userId: string
  age: number
  weightInGrams: number
  bodyFatPercentage: number
  heightInCentimeters: number
}

interface UpdateUserTrainingMetricsUseCaseResponse {
  user: User
}

export class UpdateUserTrainingMetricsUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    age,
    weightInGrams,
    bodyFatPercentage,
    heightInCentimeters,
  }: UpdateUserTrainingMetricsUseCaseRequest): Promise<UpdateUserTrainingMetricsUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError('User not found.')
    }

    if (user.id !== userId) {
      throw new UnauthorizedError()
    }

    const updatedUser = await this.usersRepository.update({
      userId,
      data: {
        age,
        weightInGrams,
        bodyFatPercentage,
        heightInCentimeters,
      },
    })

    return {
      user: updatedUser,
    }
  }
}
