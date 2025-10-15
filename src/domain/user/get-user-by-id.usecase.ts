import type { Driver } from "@/domain/user/driver.entity";
import type { UserRepository } from "@/domain/user/user.repository";
import type { AppError } from "@/domain/utils/app-error";
import type { AsyncResult } from "@/domain/utils/result";

export class GetUserByIdUseCase<T> {
  private readonly userRepository: UserRepository<T>;

  constructor(userRepository: UserRepository<T>) {
    this.userRepository = userRepository;
  }

  async execute(id: string): AsyncResult<T, AppError> {
    return await this.userRepository.getById(id);
  }
}

export class GetDriverByIdUseCase extends GetUserByIdUseCase<Driver> {}
