import type { CreateDriverSchema } from "@/adapters/api/validation-schemas/driver.schema";
import type { Driver } from "@/domain/features/driver/driver.model";
import type { DriverRepository } from "@/domain/features/driver/driver.repository";

import type { AppError } from "@/domain/utils/app-error";
import type { AsyncResult } from "@/domain/utils/result";

export class CreateDriverUseCase {
  private readonly driverRepository: DriverRepository;

  constructor(driverRepository: DriverRepository) {
    this.driverRepository = driverRepository;
  }

  async execute(input: CreateDriverSchema): AsyncResult<Driver, AppError> {
    return await this.driverRepository.create(input);
  }
}
