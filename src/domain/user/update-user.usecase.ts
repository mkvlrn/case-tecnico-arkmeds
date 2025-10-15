import type { CreateDriverSchema } from "@/adapters/api/driver/create-driver.schema";
import type { Driver } from "@/domain/user/driver.entity";
import type { UserRepository } from "@/domain/user/user.repository";
import type { AppError } from "@/domain/utils/app-error";
import { type AsyncResult, R } from "@/domain/utils/result";

export class UpdateUserUseCase<T, S> {
  private readonly userRepository: UserRepository<T, S>;

  constructor(userRepository: UserRepository<T, S>) {
    this.userRepository = userRepository;
  }

  async execute(id: string, input: S): AsyncResult<T, AppError> {
    const existing = await this.userRepository.getById(id);
    if (existing.isError) {
      return R.error(existing.error);
    }

    return await this.userRepository.update(id, input);
  }
}

export class UpdateDriverUseCase extends UpdateUserUseCase<Driver, CreateDriverSchema> {}
