import type { Driver } from "@/domain/features/driver/driver.model";
import type { DriverRepository } from "@/domain/shared/base-user.repository";
import { DeleteBaseUserUseCase } from "@/domain/shared/delete-base-user.usecase";

export class DeleteDriverUseCase extends DeleteBaseUserUseCase<Driver, DriverRepository> {
  constructor(driverRepository: DriverRepository) {
    super(driverRepository, "driver");
  }
}
