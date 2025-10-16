import type { CreatePassengerSchema } from "@/adapters/api/validation-schemas/passenger.schema";
import type { Passenger } from "@/domain/features/passenger/passenger.model";
import type { PassengerRepository } from "@/domain/features/passenger/passenger.repository";

import type { AppError } from "@/domain/utils/app-error";
import type { AsyncResult } from "@/domain/utils/result";

export class CreatePassengerUseCase {
  private readonly passengerRepository: PassengerRepository;

  constructor(passengerRepository: PassengerRepository) {
    this.passengerRepository = passengerRepository;
  }

  async execute(input: CreatePassengerSchema): AsyncResult<Passenger, AppError> {
    return await this.passengerRepository.create(input);
  }
}
