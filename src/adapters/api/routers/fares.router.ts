import type { AwilixContainer } from "awilix";
import { createCrudRouter } from "@/adapters/api/factories/crud-router.factory";
import { CreateFareSchema } from "@/adapters/api/validation-schemas/fare.schema";
import type { AppContainer } from "@/infra/container/types";

export function getFaresRouter(container: AwilixContainer<AppContainer>) {
  const { createFareController } = container.cradle;

  return createCrudRouter({ create: createFareController }, CreateFareSchema);
}
