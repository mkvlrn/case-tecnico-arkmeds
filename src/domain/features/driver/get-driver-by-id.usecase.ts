import type { Driver } from "@/domain/features/driver/driver.model";
import type { DriverRepository } from "@/domain/shared/base-user.repository";
import { GetByIdBaseUserUseCase } from "@/domain/shared/get-base-user-by-id.usecase";

export class GetDriverByIdUseCase extends GetByIdBaseUserUseCase<Driver, DriverRepository> {
  constructor(driverRepository: DriverRepository) {
    super(driverRepository, "driver");
  }
}
