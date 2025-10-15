import type { Driver } from "@/domain/driver/driver.entity";
import type { UserRepository } from "@/domain/misc/user.repository";
import type { AppError } from "@/domain/utils/app-error";
import { type AsyncResult, R } from "@/domain/utils/result";

export class DeleteDriverUseCase {
  private readonly driverRepository: UserRepository<Driver>;

  constructor(driverRepository: UserRepository<Driver>) {
    this.driverRepository = driverRepository;
  }

  async execute(id: string): AsyncResult<true, AppError> {
    const existing = await this.driverRepository.getById(id);
    if (existing.isError) {
      return R.error(existing.error);
    }

    return await this.driverRepository.delete(id);
  }
}
