import type { Driver } from "@/domain/user/driver.entity";
import type { UserRepository } from "@/domain/user/user.repository";
import type { AppError } from "@/domain/utils/app-error";
import { type AsyncResult, R } from "@/domain/utils/result";

export class DeleteUserUseCase<T> {
  private readonly userRepository: UserRepository<T>;

  constructor(userRepository: UserRepository<T>) {
    this.userRepository = userRepository;
  }

  async execute(id: string): AsyncResult<true, AppError> {
    const existing = await this.userRepository.getById(id);
    if (existing.isError) {
      return R.error(existing.error);
    }

    return await this.userRepository.delete(id);
  }
}

export class DeleteDriverUseCase extends DeleteUserUseCase<Driver> {}
