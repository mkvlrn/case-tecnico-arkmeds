import type { CreateDriverSchema } from "@/adapters/api/driver/create-driver.schema";
import type { Driver } from "@/domain/driver/driver.entity";
import type { UserRepository } from "@/domain/misc/user.repository";
import type { AppError } from "@/domain/utils/app-error";
import type { AsyncResult } from "@/domain/utils/result";

export class CreateDriverUseCase {
  private readonly driverRepository: UserRepository<Driver, CreateDriverSchema>;

  constructor(driverRepository: UserRepository<Driver, CreateDriverSchema>) {
    this.driverRepository = driverRepository;
  }

  async execute(input: CreateDriverSchema): AsyncResult<Driver, AppError> {
    return await this.driverRepository.create(input);
  }
}
