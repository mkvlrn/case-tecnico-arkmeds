import type { AwilixContainer } from "awilix";
import { asFunction } from "awilix";
import { CreateDriverController } from "@/adapters/api/controllers/drivers/create-driver.controller";
import { DeleteDriverController } from "@/adapters/api/controllers/drivers/delete-driver.controller";
import { GetAllDriversController } from "@/adapters/api/controllers/drivers/get-all-drivers.controller";
import { GetDriverByIdController } from "@/adapters/api/controllers/drivers/get-driver-by-id.controller";
import { UpdateDriverController } from "@/adapters/api/controllers/drivers/update-driver.controller";
import { CreateFareController } from "@/adapters/api/controllers/fares/create-fare.controller";
import { CreatePassengerController } from "@/adapters/api/controllers/passengers/create-passenger.controller";
import { DeletePassengerController } from "@/adapters/api/controllers/passengers/delete-passenger.controller";
import { GetAllPassengersController } from "@/adapters/api/controllers/passengers/get-all-passengers.controller";
import { GetPassengerByIdController } from "@/adapters/api/controllers/passengers/get-passenger-by-id.controller";
import { UpdatePassengerController } from "@/adapters/api/controllers/passengers/update-passenger.controller";
import { CreateTripController } from "@/adapters/api/controllers/trips/create-trip.controller";
import type { AppContainer } from "@/infra/container/types";

export function registerControllers(container: AwilixContainer<AppContainer>) {
  container.register({
    // driver controllers
    createDriverController: asFunction(
      ({ createDriverUseCase }: AppContainer) => new CreateDriverController(createDriverUseCase),
    ).scoped(),
    deleteDriverController: asFunction(
      ({ deleteDriverUseCase }: AppContainer) => new DeleteDriverController(deleteDriverUseCase),
    ).scoped(),
    getAllDriversController: asFunction(
      ({ getAllDriversUseCase }: AppContainer) => new GetAllDriversController(getAllDriversUseCase),
    ).scoped(),
    getDriverByIdController: asFunction(
      ({ getDriverByIdUseCase }: AppContainer) => new GetDriverByIdController(getDriverByIdUseCase),
    ).scoped(),
    updateDriverController: asFunction(
      ({ updateDriverUseCase }: AppContainer) => new UpdateDriverController(updateDriverUseCase),
    ).scoped(),

    // passenger controllers
    createPassengerController: asFunction(
      ({ createPassengerUseCase }: AppContainer) =>
        new CreatePassengerController(createPassengerUseCase),
    ).scoped(),
    deletePassengerController: asFunction(
      ({ deletePassengerUseCase }: AppContainer) =>
        new DeletePassengerController(deletePassengerUseCase),
    ).scoped(),
    getAllPassengersController: asFunction(
      ({ getAllPassengersUseCase }: AppContainer) =>
        new GetAllPassengersController(getAllPassengersUseCase),
    ).scoped(),
    getPassengerByIdController: asFunction(
      ({ getPassengerByIdUseCase }: AppContainer) =>
        new GetPassengerByIdController(getPassengerByIdUseCase),
    ).scoped(),
    updatePassengerController: asFunction(
      ({ updatePassengerUseCase }: AppContainer) =>
        new UpdatePassengerController(updatePassengerUseCase),
    ).scoped(),

    // fare and trip controllers
    createFareController: asFunction(
      ({ createFareUseCase }: AppContainer) => new CreateFareController(createFareUseCase),
    ).scoped(),
    createTripController: asFunction(
      ({ createTripUseCase }: AppContainer) => new CreateTripController(createTripUseCase),
    ).scoped(),
  });
}
