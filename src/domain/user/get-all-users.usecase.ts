import type { Driver } from "@/domain/user/driver.entity";
import type { UserRepository } from "@/domain/user/user.repository";
import type { AppError } from "@/domain/utils/app-error";
import type { PaginationResult } from "@/domain/utils/pagination-result";
import { type AsyncResult, R } from "@/domain/utils/result";

export class GetAllUsersUseCase<T> {
  private readonly userRepository: UserRepository<T>;

  constructor(userRepository: UserRepository<T>) {
    this.userRepository = userRepository;
  }

  async execute(page = 1): AsyncResult<PaginationResult<T>, AppError> {
    const total = await this.userRepository.count();
    if (total.isError) {
      return R.error(total.error);
    }

    const drivers = await this.userRepository.getAll(page);
    if (drivers.isError) {
      return R.error(drivers.error);
    }

    return R.ok({
      total: total.value,
      totalPages: Math.ceil(total.value / 10),
      page,
      items: drivers.value,
    });
  }
}

export class GetAllDriversUseCase extends GetAllUsersUseCase<Driver> {}
