import type { CreatePassengerSchema } from "@/adapters/api/validation-schemas/passenger.schema";
import type { Passenger } from "@/domain/features/passenger/passenger.model";
import type { PassengerRepository } from "@/domain/shared/base-user.repository";
import { CreateUserBaseUseCase } from "@/domain/shared/create-base-user.usecase";

export class CreatePassengerUseCase extends CreateUserBaseUseCase<
  Passenger,
  CreatePassengerSchema,
  PassengerRepository
> {
  constructor(passengerRepository: PassengerRepository) {
    super(passengerRepository, "passenger");
  }
}
