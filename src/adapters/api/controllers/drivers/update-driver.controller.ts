import { UpdateBaseUserController } from "@/adapters/api/controllers/base/update-base-user.controller";
import type { CreateDriverSchema } from "@/adapters/api/validation-schemas/driver.schema";
import type { Driver } from "@/domain/features/driver/driver.model";
import type { UpdateDriverUseCase } from "@/domain/features/driver/update-driver.usecase";
import type { DriverRepository } from "@/domain/shared/base-user.repository";

export class UpdateDriverController extends UpdateBaseUserController<
  Driver,
  CreateDriverSchema,
  DriverRepository,
  UpdateDriverUseCase
> {}
