import { DeleteBaseUserController } from "@/adapters/api/controllers/base/delete-base-user.controller";
import type { DeletePassengerUseCase } from "@/domain/features/passenger/delete-passenger.usecase";
import type { Passenger } from "@/domain/features/passenger/passenger.model";
import type { PassengerRepository } from "@/domain/shared/base-user.repository";

export class DeletePassengerController extends DeleteBaseUserController<
  Passenger,
  PassengerRepository,
  DeletePassengerUseCase
> {}
