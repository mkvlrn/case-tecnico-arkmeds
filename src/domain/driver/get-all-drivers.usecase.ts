import type { Driver } from "@/domain/driver/driver.entity";
import type { UserRepository } from "@/domain/misc/user.repository";
import type { AppError } from "@/domain/utils/app-error";
import type { PaginationResult } from "@/domain/utils/pagination-result";
import { type AsyncResult, R } from "@/domain/utils/result";

export class GetAllDriversUseCase {
  private readonly driverRepository: UserRepository<Driver>;

  constructor(driverRepository: UserRepository<Driver>) {
    this.driverRepository = driverRepository;
  }

  async execute(page = 1): AsyncResult<PaginationResult<Driver>, AppError> {
    const total = await this.driverRepository.count();
    if (total.isError) {
      return R.error(total.error);
    }

    const drivers = await this.driverRepository.getAll(page);
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
