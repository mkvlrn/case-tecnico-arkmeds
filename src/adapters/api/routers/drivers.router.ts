import { Router } from "express";
import { CreateDriverController } from "@/adapters/api/controllers/create-driver.controller";
import { DeleteDriverController } from "@/adapters/api/controllers/delete-driver.controller";
import { GetAllDriversController } from "@/adapters/api/controllers/get-all-drivers.controller";
import { GetDriverByIdController } from "@/adapters/api/controllers/get-driver-by-id.controller";
import { UpdateDriverController } from "@/adapters/api/controllers/update-driver.controller";
import { validation } from "@/adapters/api/middlewares/validation.middleware";
import { CreateDriverSchema } from "@/adapters/api/validation-schemas/driver.schema";
import { PaginatedResultQuery } from "@/adapters/api/validation-schemas/paginated-result.schema";
import { CreateDriverUseCase } from "@/domain/features/driver/create-driver.usecase";
import { DeleteDriverUseCase } from "@/domain/features/driver/delete-driver.usecase";
import { GetAllDriversUseCase } from "@/domain/features/driver/get-all-drivers.usecase";
import { GetDriverByIdUseCase } from "@/domain/features/driver/get-driver-by-id.usecase";
import { UpdateDriverUseCase } from "@/domain/features/driver/update-driver.usecase";
import type { PrismaClient } from "@/generated/prisma/client";
import { DriverPrismaRepo } from "@/infra/prisma/repositories/driver.prisma-repo";

export function getDriversRouter(prisma: PrismaClient) {
  const router = Router();
  const driverRepository = new DriverPrismaRepo(prisma);

  const createUseCase = new CreateDriverUseCase(driverRepository);
  const createController = new CreateDriverController(createUseCase);
  router.post("/", validation(CreateDriverSchema), createController.handle.bind(createController));

  const getAllUseCase = new GetAllDriversUseCase(driverRepository);
  const getAllController = new GetAllDriversController(getAllUseCase);
  router.get(
    "/",
    validation(PaginatedResultQuery, "query"),
    getAllController.handle.bind(getAllController),
  );

  const getByIdUseCase = new GetDriverByIdUseCase(driverRepository);
  const getByIdController = new GetDriverByIdController(getByIdUseCase);
  router.get("/:id", getByIdController.handle.bind(getByIdController));

  const updateUseCase = new UpdateDriverUseCase(driverRepository);
  const updateController = new UpdateDriverController(updateUseCase);
  router.put(
    "/:id",
    validation(CreateDriverSchema),
    updateController.handle.bind(updateController),
  );

  const deleteUseCase = new DeleteDriverUseCase(driverRepository);
  const deleteController = new DeleteDriverController(deleteUseCase);
  router.delete("/:id", deleteController.handle.bind(deleteController));

  return router;
}
