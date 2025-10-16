import type { CreatePassengerSchema } from "@/adapters/api/validation-schemas/passenger.schema";
import type { Passenger } from "@/domain/features/passenger/passenger.model";
import type { PassengerRepository } from "@/domain/shared/base-user.repository";
import { UpdateBaseUserUseCase } from "@/domain/shared/update-base-user.usecase";

export class UpdatePassengerUseCase extends UpdateBaseUserUseCase<
  Passenger,
  CreatePassengerSchema,
  PassengerRepository
> {
  constructor(passengerRepository: PassengerRepository) {
    super(passengerRepository, "passenger");
  }
}
