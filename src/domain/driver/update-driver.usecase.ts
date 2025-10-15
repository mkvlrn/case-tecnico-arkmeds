import type { CreateDriverSchema } from "@/adapters/api/driver/create-driver.schema";
import type { Driver } from "@/domain/driver/driver.entity";
import type { UserRepository } from "@/domain/misc/user.repository";
import type { AppError } from "@/domain/utils/app-error";
import { type AsyncResult, R } from "@/domain/utils/result";

export class UpdateDriverUseCase {
  private readonly driverRepository: UserRepository<Driver, CreateDriverSchema>;

  constructor(driverRepository: UserRepository<Driver, CreateDriverSchema>) {
    this.driverRepository = driverRepository;
  }

  async execute(id: string, input: CreateDriverSchema): AsyncResult<Driver, AppError> {
    const existing = await this.driverRepository.getById(id);
    if (existing.isError) {
      return R.error(existing.error);
    }

    return await this.driverRepository.update(id, input);
  }
}
