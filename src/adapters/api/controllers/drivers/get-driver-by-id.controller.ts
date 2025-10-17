import { GetBaseUserByIdController } from "@/adapters/api/controllers/base/get-base-user-by-id.controller";
import type { Driver } from "@/domain/features/driver/driver.model";
import type { GetDriverByIdUseCase } from "@/domain/features/driver/get-driver-by-id.usecase";
import type { DriverRepository } from "@/domain/shared/base-user.repository";

export class GetDriverByIdController extends GetBaseUserByIdController<
  Driver,
  DriverRepository,
  GetDriverByIdUseCase
> {}
