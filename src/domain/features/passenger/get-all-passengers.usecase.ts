import type { Passenger } from "@/domain/features/passenger/passenger.model";
import type { PassengerRepository } from "@/domain/shared/base-user.repository";
import { GetAllBaseUserUseCase } from "@/domain/shared/get-all-base-users.usecase";

export class GetAllPassengersUseCase extends GetAllBaseUserUseCase<
  Passenger,
  PassengerRepository
> {}
