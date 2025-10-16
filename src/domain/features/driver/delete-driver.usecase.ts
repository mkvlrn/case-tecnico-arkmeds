import type { DriverRepository } from "@/domain/features/driver/driver.repository";
import type { AppError } from "@/domain/utils/app-error";
import { type AsyncResult, R } from "@/domain/utils/result";

export class DeleteDriverUseCase {
  private readonly driverRepository: DriverRepository;

  constructor(driverRepository: DriverRepository) {
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
