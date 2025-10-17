import { CreatePassengerController } from "@/adapters/api/controllers/passengers/create-passenger.controller";
import { DeletePassengerController } from "@/adapters/api/controllers/passengers/delete-passenger.controller";
import { GetAllPassengersController } from "@/adapters/api/controllers/passengers/get-all-passengers.controller";
import { GetPassengerByIdController } from "@/adapters/api/controllers/passengers/get-passenger-by-id.controller";
import { UpdatePassengerController } from "@/adapters/api/controllers/passengers/update-passenger.controller";
import { createCrudRouter } from "@/adapters/api/factories/crud-router.factory";
import { CreatePassengerSchema } from "@/adapters/api/validation-schemas/passenger.schema";
import { CreatePassengerUseCase } from "@/domain/features/passenger/create-passenger.usecase";
import { DeletePassengerUseCase } from "@/domain/features/passenger/delete-passenger.usecase";
import { GetAllPassengersUseCase } from "@/domain/features/passenger/get-all-passengers.usecase";
import { GetPassengerByIdUseCase } from "@/domain/features/passenger/get-passenger-by-id.usecase";
import { UpdatePassengerUseCase } from "@/domain/features/passenger/update-passenger.usecase";
import type { PrismaClient } from "@/generated/prisma/client";
import { PassengerPrismaRepo } from "@/infra/prisma/repositories/passenger.prisma-repo";

export function getPassengersRouter(prisma: PrismaClient) {
  const repo = new PassengerPrismaRepo(prisma);

  return createCrudRouter(
    {
      create: new CreatePassengerController(new CreatePassengerUseCase(repo)),
      getAll: new GetAllPassengersController(new GetAllPassengersUseCase(repo)),
      getById: new GetPassengerByIdController(new GetPassengerByIdUseCase(repo)),
      update: new UpdatePassengerController(new UpdatePassengerUseCase(repo)),
      delete: new DeletePassengerController(new DeletePassengerUseCase(repo)),
    },
    CreatePassengerSchema,
  );
}
