import { DeleteBaseUserController } from "@/adapters/api/controllers/base/delete-base-user.controller";
import type { DeleteDriverUseCase } from "@/domain/features/driver/delete-driver.usecase";
import type { Driver } from "@/domain/features/driver/driver.model";
import type { DriverRepository } from "@/domain/shared/base-user.repository";

export class DeleteDriverController extends DeleteBaseUserController<
  Driver,
  DriverRepository,
  DeleteDriverUseCase
> {}
