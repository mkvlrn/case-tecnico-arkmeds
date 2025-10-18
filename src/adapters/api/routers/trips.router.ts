import type { AwilixContainer } from "awilix";
import { createCrudRouter } from "@/adapters/api/factories/crud-router.factory";
import { CreateTripSchema } from "@/adapters/api/validation-schemas/trip.schema";
import type { ContainerDependencies } from "@/infra/container";

export function getTripsRouter(container: AwilixContainer<ContainerDependencies>) {
  const { createTripController } = container.cradle;

  return createCrudRouter({ create: createTripController }, CreateTripSchema);
}
