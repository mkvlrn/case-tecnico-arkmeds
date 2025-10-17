import { CreateDriverController } from "@/adapters/api/controllers/drivers/create-driver.controller";
import { DeleteDriverController } from "@/adapters/api/controllers/drivers/delete-driver.controller";
import { GetAllDriversController } from "@/adapters/api/controllers/drivers/get-all-drivers.controller";
import { GetDriverByIdController } from "@/adapters/api/controllers/drivers/get-driver-by-id.controller";
import { UpdateDriverController } from "@/adapters/api/controllers/drivers/update-driver.controller";
import { createCrudRouter } from "@/adapters/api/factories/crud-router.factory";
import { CreateDriverSchema } from "@/adapters/api/validation-schemas/driver.schema";
import { CreateDriverUseCase } from "@/domain/features/driver/create-driver.usecase";
import { DeleteDriverUseCase } from "@/domain/features/driver/delete-driver.usecase";
import { GetAllDriversUseCase } from "@/domain/features/driver/get-all-drivers.usecase";
import { GetDriverByIdUseCase } from "@/domain/features/driver/get-driver-by-id.usecase";
import { UpdateDriverUseCase } from "@/domain/features/driver/update-driver.usecase";
import type { PrismaClient } from "@/generated/prisma/client";
import { DriverPrismaRepo } from "@/infra/prisma/repositories/driver.prisma-repo";

export function getDriversRouter(prisma: PrismaClient) {
  const repo = new DriverPrismaRepo(prisma);

  return createCrudRouter(
    {
      create: new CreateDriverController(new CreateDriverUseCase(repo)),
      getAll: new GetAllDriversController(new GetAllDriversUseCase(repo)),
      getById: new GetDriverByIdController(new GetDriverByIdUseCase(repo)),
      update: new UpdateDriverController(new UpdateDriverUseCase(repo)),
      delete: new DeleteDriverController(new DeleteDriverUseCase(repo)),
    },
    CreateDriverSchema,
  );
}
