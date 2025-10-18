import type { AwilixContainer } from "awilix";
import { createCrudRouter } from "@/adapters/api/factories/crud-router.factory";
import { CreateDriverSchema } from "@/adapters/api/validation-schemas/driver.schema";
import type { ContainerDependencies } from "@/infra/container";

export function getDriversRouter(container: AwilixContainer<ContainerDependencies>) {
  const {
    createDriverController,
    getAllDriversController,
    getDriverByIdController,
    updateDriverController,
    deleteDriverController,
  } = container.cradle;

  return createCrudRouter(
    {
      create: createDriverController,
      getAll: getAllDriversController,
      getById: getDriverByIdController,
      update: updateDriverController,
      delete: deleteDriverController,
    },
    CreateDriverSchema,
  );
}
