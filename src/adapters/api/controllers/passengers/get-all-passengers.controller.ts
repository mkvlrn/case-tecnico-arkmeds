import { GetAllBaseUsersController } from "@/adapters/api/controllers/base/get-all-base-users.controller";
import type { GetAllPassengersUseCase } from "@/domain/features/passenger/get-all-passengers.usecase";
import type { Passenger } from "@/domain/features/passenger/passenger.model";
import type { PassengerRepository } from "@/domain/shared/base-user.repository";

export class GetAllPassengersController extends GetAllBaseUsersController<
  Passenger,
  PassengerRepository,
  GetAllPassengersUseCase
> {}
