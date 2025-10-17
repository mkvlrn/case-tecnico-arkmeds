import { GetBaseUserByIdController } from "@/adapters/api/controllers/base/get-base-user-by-id.controller";
import type { GetPassengerByIdUseCase } from "@/domain/features/passenger/get-passenger-by-id.usecase";
import type { Passenger } from "@/domain/features/passenger/passenger.model";
import type { PassengerRepository } from "@/domain/shared/base-user.repository";

export class GetPassengerByIdController extends GetBaseUserByIdController<
  Passenger,
  PassengerRepository,
  GetPassengerByIdUseCase
> {}
