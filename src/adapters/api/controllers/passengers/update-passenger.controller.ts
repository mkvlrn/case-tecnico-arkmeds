import { UpdateBaseUserController } from "@/adapters/api/controllers/base/update-base-user.controller";
import type { CreatePassengerSchema } from "@/adapters/api/validation-schemas/passenger.schema";
import type { Passenger } from "@/domain/features/passenger/passenger.model";
import type { UpdatePassengerUseCase } from "@/domain/features/passenger/update-passenger.usecase";
import type { PassengerRepository } from "@/domain/shared/base-user.repository";

export class UpdatePassengerController extends UpdateBaseUserController<
  Passenger,
  CreatePassengerSchema,
  PassengerRepository,
  UpdatePassengerUseCase
> {}
