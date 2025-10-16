import type { DriverRepository } from "@/domain/features/driver/driver.repository";
import { AppError } from "@/domain/utils/app-error";
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
    if (existing.value === null) {
      return R.error(new AppError("resourceNotFound", `driver with id ${id} not found`));
    }

    return await this.driverRepository.delete(id);
  }
}
