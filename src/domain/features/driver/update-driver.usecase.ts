import type { CreateDriverSchema } from "@/adapters/api/validation-schemas/driver.schema";
import type { Driver } from "@/domain/features/driver/driver.model";
import type { DriverRepository } from "@/domain/features/driver/driver.repository";

import { AppError } from "@/domain/utils/app-error";
import { type AsyncResult, R } from "@/domain/utils/result";

export class UpdateDriverUseCase {
  private readonly driverRepository: DriverRepository;

  constructor(driverRepository: DriverRepository) {
    this.driverRepository = driverRepository;
  }

  async execute(id: string, input: CreateDriverSchema): AsyncResult<Driver, AppError> {
    const existing = await this.driverRepository.getById(id);
    if (existing.isError) {
      return R.error(existing.error);
    }

    const conflict = await this.driverRepository.getByCpf(input.cpf);
    if (conflict.isError) {
      return R.error(conflict.error);
    }
    if (conflict.isOk && conflict.value !== null) {
      return R.error(
        new AppError("resourceConflict", `driver with cpf ${input.cpf} already exists`),
      );
    }

    return await this.driverRepository.update(id, input);
  }
}
