import { Router } from "express";
import { CreatePassengerController } from "@/adapters/api/controllers/passengers/create-passenger.controller";
import { DeletePassengerController } from "@/adapters/api/controllers/passengers/delete-passenger.controller";
import { GetAllPassengersController } from "@/adapters/api/controllers/passengers/get-all-passengers.controller";
import { GetPassengerByIdController } from "@/adapters/api/controllers/passengers/get-passenger-by-id.controller";
import { UpdatePassengerController } from "@/adapters/api/controllers/passengers/update-passenger.controller";
import { validation } from "@/adapters/api/middlewares/validation.middleware";
import { PaginatedResultQuery } from "@/adapters/api/validation-schemas/paginated-result.schema";
import { CreatePassengerSchema } from "@/adapters/api/validation-schemas/passenger.schema";
import { CreatePassengerUseCase } from "@/domain/features/passenger/create-passenger.usecase";
import { DeletePassengerUseCase } from "@/domain/features/passenger/delete-passenger.usecase";
import { GetAllPassengersUseCase } from "@/domain/features/passenger/get-all-passengers.usecase";
import { GetPassengerByIdUseCase } from "@/domain/features/passenger/get-passenger-by-id.usecase";
import { UpdatePassengerUseCase } from "@/domain/features/passenger/update-passenger.usecase";
import type { PrismaClient } from "@/generated/prisma/client";
import { PassengerPrismaRepo } from "@/infra/prisma/repositories/passenger.prisma-repo";

export function getPassengersRouter(prisma: PrismaClient) {
  const router = Router();
  const passengerRepository = new PassengerPrismaRepo(prisma);

  const createUseCase = new CreatePassengerUseCase(passengerRepository);
  const createController = new CreatePassengerController(createUseCase);
  router.post(
    "/",
    validation(CreatePassengerSchema),
    createController.handle.bind(createController),
  );

  const getAllUseCase = new GetAllPassengersUseCase(passengerRepository);
  const getAllController = new GetAllPassengersController(getAllUseCase);
  router.get(
    "/",
    validation(PaginatedResultQuery, "query"),
    getAllController.handle.bind(getAllController),
  );

  const getByIdUseCase = new GetPassengerByIdUseCase(passengerRepository);
  const getByIdController = new GetPassengerByIdController(getByIdUseCase);
  router.get("/:id", getByIdController.handle.bind(getByIdController));

  const updateUseCase = new UpdatePassengerUseCase(passengerRepository);
  const updateController = new UpdatePassengerController(updateUseCase);
  router.put(
    "/:id",
    validation(CreatePassengerSchema),
    updateController.handle.bind(updateController),
  );

  const deleteUseCase = new DeletePassengerUseCase(passengerRepository);
  const deleteController = new DeletePassengerController(deleteUseCase);
  router.delete("/:id", deleteController.handle.bind(deleteController));

  return router;
}
