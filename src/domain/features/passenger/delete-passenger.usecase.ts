import type { Passenger } from "@/domain/features/passenger/passenger.model";
import type { PassengerRepository } from "@/domain/shared/base-user.repository";
import { DeleteBaseUserUseCase } from "@/domain/shared/delete-base-user.usecase";

export class DeletePassengerUseCase extends DeleteBaseUserUseCase<Passenger, PassengerRepository> {
  constructor(passengerRepository: PassengerRepository) {
    super(passengerRepository, "passenger");
  }
}
