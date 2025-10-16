import type { CreateDriverSchema } from "@/adapters/api/validation-schemas/driver.schema";
import type { Driver } from "@/domain/features/driver/driver.model";
import type { DriverRepository } from "@/domain/shared/base-user.repository";
import { CreateUserBaseUseCase } from "@/domain/shared/create-base-user.usecase";

export class CreateDriverUseCase extends CreateUserBaseUseCase<
  Driver,
  CreateDriverSchema,
  DriverRepository
> {
  constructor(driverRepository: DriverRepository) {
    super(driverRepository, "driver");
  }
}
