import type { CreatePassengerSchema } from "@/adapters/api/validation-schemas/passenger.schema";
import type { Passenger } from "@/domain/features/passenger/passenger.model";
import type { PassengerRepository } from "@/domain/features/passenger/passenger.repository";

import { AppError } from "@/domain/utils/app-error";
import { type AsyncResult, R } from "@/domain/utils/result";

export class CreatePassengerUseCase {
  private readonly passengerRepository: PassengerRepository;

  constructor(passengerRepository: PassengerRepository) {
    this.passengerRepository = passengerRepository;
  }

  async execute(input: CreatePassengerSchema): AsyncResult<Passenger, AppError> {
    const existing = await this.passengerRepository.getByCpf(input.cpf);
    if (existing.isError) {
      return R.error(existing.error);
    }
    if (existing.value !== null) {
      return R.error(
        new AppError("resourceConflict", `passenger with cpf ${input.cpf} already exists`),
      );
    }

    return await this.passengerRepository.create(input);
  }
}
