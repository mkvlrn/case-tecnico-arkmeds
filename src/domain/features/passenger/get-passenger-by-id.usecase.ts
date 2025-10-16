import type { Passenger } from "@/domain/features/passenger/passenger.model";
import type { PassengerRepository } from "@/domain/shared/base-user.repository";
import { GetByIdBaseUserUseCase } from "@/domain/shared/get-base-user-by-id.usecase";

export class GetPassengerByIdUseCase extends GetByIdBaseUserUseCase<
  Passenger,
  PassengerRepository
> {
  constructor(passengerRepository: PassengerRepository) {
    super(passengerRepository, "passenger");
  }
}
