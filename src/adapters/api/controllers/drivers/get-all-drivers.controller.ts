import { GetAllBaseUsersController } from "@/adapters/api/controllers/base/get-all-base-users.controller";
import type { Driver } from "@/domain/features/driver/driver.model";
import type { GetAllDriversUseCase } from "@/domain/features/driver/get-all-drivers.usecase";
import type { DriverRepository } from "@/domain/shared/base-user.repository";

export class GetAllDriversController extends GetAllBaseUsersController<
  Driver,
  DriverRepository,
  GetAllDriversUseCase
> {}
