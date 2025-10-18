import type { AwilixContainer } from "awilix";
import { createCrudRouter } from "@/adapters/api/factories/crud-router.factory";
import { CreateTripSchema } from "@/adapters/api/validation-schemas/trip.schema";
import type { AppContainer } from "@/infra/container/types";

export function getTripsRouter(container: AwilixContainer<AppContainer>) {
  const { createTripController } = container.cradle;

  return createCrudRouter({ create: createTripController }, CreateTripSchema);
}
