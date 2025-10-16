import type { CreateDriverSchema } from "@/adapters/api/validation-schemas/driver.schema";
import type { Driver } from "@/domain/features/driver/driver.model";
import type { DriverRepository } from "@/domain/shared/base-user.repository";
import { UpdateBaseUserUseCase } from "@/domain/shared/update-base-user.usecase";

export class UpdateDriverUseCase extends UpdateBaseUserUseCase<
  Driver,
  CreateDriverSchema,
  DriverRepository
> {
  constructor(driverRepository: DriverRepository) {
    super(driverRepository, "driver");
  }
}
