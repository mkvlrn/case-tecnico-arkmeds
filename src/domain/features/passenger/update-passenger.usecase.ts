import type { CreatePassengerSchema } from "@/adapters/api/validation-schemas/passenger.schema";
import type { Passenger } from "@/domain/features/passenger/passenger.model";
import type { PassengerRepository } from "@/domain/features/passenger/passenger.repository";

import type { AppError } from "@/domain/utils/app-error";
import { type AsyncResult, R } from "@/domain/utils/result";

export class UpdatePassengerUseCase {
  private readonly passengerRepository: PassengerRepository;

  constructor(passengerRepository: PassengerRepository) {
    this.passengerRepository = passengerRepository;
  }

  async execute(id: string, input: CreatePassengerSchema): AsyncResult<Passenger, AppError> {
    const existing = await this.passengerRepository.getById(id);
    if (existing.isError) {
      return R.error(existing.error);
    }

    return await this.passengerRepository.update(id, input);
  }
}
