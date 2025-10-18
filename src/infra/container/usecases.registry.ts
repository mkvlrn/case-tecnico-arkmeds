import type { AwilixContainer } from "awilix";
import { asFunction } from "awilix";
import { CreateDriverUseCase } from "@/domain/features/driver/create-driver.usecase";
import { DeleteDriverUseCase } from "@/domain/features/driver/delete-driver.usecase";
import { GetAllDriversUseCase } from "@/domain/features/driver/get-all-drivers.usecase";
import { GetDriverByIdUseCase } from "@/domain/features/driver/get-driver-by-id.usecase";
import { UpdateDriverUseCase } from "@/domain/features/driver/update-driver.usecase";
import { CreateFareUseCase } from "@/domain/features/fare/create-fare.usecase";
import { CreatePassengerUseCase } from "@/domain/features/passenger/create-passenger.usecase";
import { DeletePassengerUseCase } from "@/domain/features/passenger/delete-passenger.usecase";
import { GetAllPassengersUseCase } from "@/domain/features/passenger/get-all-passengers.usecase";
import { GetPassengerByIdUseCase } from "@/domain/features/passenger/get-passenger-by-id.usecase";
import { UpdatePassengerUseCase } from "@/domain/features/passenger/update-passenger.usecase";
import { CreateTripUseCase } from "@/domain/features/trip/create-trip.usecase";
import type { AppContainer } from "@/infra/container/types";

export function registerUseCases(container: AwilixContainer<AppContainer>) {
  container.register({
    // driver usecases
    createDriverUseCase: asFunction(
      ({ driverRepository }: AppContainer) => new CreateDriverUseCase(driverRepository),
    ).scoped(),
    deleteDriverUseCase: asFunction(
      ({ driverRepository }: AppContainer) => new DeleteDriverUseCase(driverRepository),
    ).scoped(),
    getAllDriversUseCase: asFunction(
      ({ driverRepository }: AppContainer) => new GetAllDriversUseCase(driverRepository),
    ).scoped(),
    getDriverByIdUseCase: asFunction(
      ({ driverRepository }: AppContainer) => new GetDriverByIdUseCase(driverRepository),
    ).scoped(),
    updateDriverUseCase: asFunction(
      ({ driverRepository }: AppContainer) => new UpdateDriverUseCase(driverRepository),
    ).scoped(),

    // passenger usecases
    createPassengerUseCase: asFunction(
      ({ passengerRepository }: AppContainer) => new CreatePassengerUseCase(passengerRepository),
    ).scoped(),
    deletePassengerUseCase: asFunction(
      ({ passengerRepository }: AppContainer) => new DeletePassengerUseCase(passengerRepository),
    ).scoped(),
    getAllPassengersUseCase: asFunction(
      ({ passengerRepository }: AppContainer) => new GetAllPassengersUseCase(passengerRepository),
    ).scoped(),
    getPassengerByIdUseCase: asFunction(
      ({ passengerRepository }: AppContainer) => new GetPassengerByIdUseCase(passengerRepository),
    ).scoped(),
    updatePassengerUseCase: asFunction(
      ({ passengerRepository }: AppContainer) => new UpdatePassengerUseCase(passengerRepository),
    ).scoped(),

    // fare and trip usecases
    createFareUseCase: asFunction(
      ({ fareRepository, farePriceCalculator }: AppContainer) =>
        new CreateFareUseCase(fareRepository, farePriceCalculator),
    ).scoped(),
    createTripUseCase: asFunction(
      ({ passengerRepository, fareRepository, tripNotifier }: AppContainer) =>
        new CreateTripUseCase(passengerRepository, fareRepository, tripNotifier),
    ).scoped(),
  });
}
