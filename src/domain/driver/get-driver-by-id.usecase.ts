import type { Driver } from "@/domain/driver/driver.entity";
import type { UserRepository } from "@/domain/misc/user.repository";
import type { AppError } from "@/domain/utils/app-error";
import type { AsyncResult } from "@/domain/utils/result";

export class GetDriverByIdUseCase {
  private readonly driverRepository: UserRepository<Driver>;

  constructor(driverRepository: UserRepository<Driver>) {
    this.driverRepository = driverRepository;
  }

  async execute(id: string): AsyncResult<Driver, AppError> {
    return await this.driverRepository.getById(id);
  }
}
