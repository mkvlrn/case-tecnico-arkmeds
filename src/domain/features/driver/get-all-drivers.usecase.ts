import type { Driver } from "@/domain/features/driver/driver.model";
import type { DriverRepository } from "@/domain/shared/base-user.repository";
import { GetAllBaseUserUseCase } from "@/domain/shared/get-all-base-users.usecase";

export class GetAllDriversUseCase extends GetAllBaseUserUseCase<Driver, DriverRepository> {}
