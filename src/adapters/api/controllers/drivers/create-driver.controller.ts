import { CreateBaseUserController } from "@/adapters/api/controllers/base/create-base-user.controller";
import type { CreateDriverSchema } from "@/adapters/api/validation-schemas/driver.schema";
import type { CreateDriverUseCase } from "@/domain/features/driver/create-driver.usecase";
import type { Driver } from "@/domain/features/driver/driver.model";
import type { DriverRepository } from "@/domain/shared/base-user.repository";

export class CreateDriverController extends CreateBaseUserController<
  Driver,
  CreateDriverSchema,
  DriverRepository,
  CreateDriverUseCase
> {}
