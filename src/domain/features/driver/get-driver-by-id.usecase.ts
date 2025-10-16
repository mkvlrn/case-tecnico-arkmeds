import type { Driver } from "@/domain/features/driver/driver.model";
import type { DriverRepository } from "@/domain/features/driver/driver.repository";
import { AppError } from "@/domain/utils/app-error";
import { type AsyncResult, R } from "@/domain/utils/result";

export class GetDriverByIdUseCase {
  private readonly driverRepository: DriverRepository;

  constructor(driverRepository: DriverRepository) {
    this.driverRepository = driverRepository;
  }

  async execute(id: string): AsyncResult<Driver, AppError> {
    const driver = await this.driverRepository.getById(id);
    if (driver.isError) {
      return R.error(driver.error);
    }

    if (driver.value === null) {
      const error = new AppError("resourceNotFound", `driver with id ${id} not found`);
      return R.error(error);
    }

    return R.ok(driver.value);
  }
}
