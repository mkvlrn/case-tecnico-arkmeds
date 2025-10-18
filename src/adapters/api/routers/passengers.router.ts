import type { AwilixContainer } from "awilix";
import { createCrudRouter } from "@/adapters/api/factories/crud-router.factory";
import { CreatePassengerSchema } from "@/adapters/api/validation-schemas/passenger.schema";
import type { ContainerDependencies } from "@/infra/container";

export function getPassengersRouter(container: AwilixContainer<ContainerDependencies>) {
  const {
    createPassengerController,
    getAllPassengersController,
    getPassengerByIdController,
    updatePassengerController,
    deletePassengerController,
  } = container.cradle;

  return createCrudRouter(
    {
      create: createPassengerController,
      getAll: getAllPassengersController,
      getById: getPassengerByIdController,
      update: updatePassengerController,
      delete: deletePassengerController,
    },
    CreatePassengerSchema,
  );
}
