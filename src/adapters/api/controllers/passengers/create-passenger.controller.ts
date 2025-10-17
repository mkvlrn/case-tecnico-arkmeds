import { CreateBaseUserController } from "@/adapters/api/controllers/base/create-base-user.controller";
import type { CreatePassengerSchema } from "@/adapters/api/validation-schemas/passenger.schema";
import type { CreatePassengerUseCase } from "@/domain/features/passenger/create-passenger.usecase";
import type { Passenger } from "@/domain/features/passenger/passenger.model";
import type { PassengerRepository } from "@/domain/shared/base-user.repository";

export class CreatePassengerController extends CreateBaseUserController<
  Passenger,
  CreatePassengerSchema,
  PassengerRepository,
  CreatePassengerUseCase
> {}
