import type {
  CreateDriverSchema,
  CreatePassengerSchema,
} from "@/adapters/api/user/create-user.schema";
import type { Driver } from "@/domain/user/driver.entity";
import type { Passenger } from "@/domain/user/passenger.entity";
import type { UserRepository } from "@/domain/user/user.repository";
import type { AppError } from "@/domain/utils/app-error";
import type { AsyncResult } from "@/domain/utils/result";

export class CreateUserUseCase<T, S> {
  private readonly userRepository: UserRepository<T, S>;

  constructor(userRepository: UserRepository<T, S>) {
    this.userRepository = userRepository;
  }

  async execute(input: S): AsyncResult<T, AppError> {
    return await this.userRepository.create(input);
  }
}

export class CreateDriverUseCase extends CreateUserUseCase<Driver, CreateDriverSchema> {}

export class CreatePassengerUseCase extends CreateUserUseCase<Passenger, CreatePassengerSchema> {}
