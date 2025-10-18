import type { AwilixContainer } from "awilix";
import { createCrudRouter } from "@/adapters/api/factories/crud-router.factory";
import { CreateFareSchema } from "@/adapters/api/validation-schemas/fare.schema";
import type { ContainerDependencies } from "@/infra/container";

export function getFaresRouter(container: AwilixContainer<ContainerDependencies>) {
  const { createFareController } = container.cradle;

  return createCrudRouter({ create: createFareController }, CreateFareSchema);
}
