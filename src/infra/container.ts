import type { PrismaClient } from "@prisma/client";
import type { RedisClientType } from "@redis/client";
import type { ChannelModel } from "amqplib";
import { asClass, asFunction, asValue, createContainer, InjectionMode } from "awilix";

// controllers
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

// usecases
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

// services and strategies
import { FarePriceCalculator } from "@/domain/services/fare-price-calculator";
import { WeekdaysDaytimeFareStrategy } from "@/domain/strategies/weekdays-daytime";
import { WeekdaysEveningFareStrategy } from "@/domain/strategies/weekdays-evening";
import { WeekdaysNightFareStrategy } from "@/domain/strategies/weekdays-night";
import { WeekendsDaytimeFareStrategy } from "@/domain/strategies/weekends-daytime";
import { WeekendsEveningFareStrategy } from "@/domain/strategies/weekends-evening";
import { WeekendsNightFareStrategy } from "@/domain/strategies/weekends-night";

// consumers and publishers
import { TripAmqpConsumer } from "@/infra/amqp/trip.amqp-consume";
import { TripAmqpPublish } from "@/infra/amqp/trip.amqp-publish";

// repositories
import { FilesystemTripReceiptRepo } from "@/infra/fs/trip-receipt.fs-repo";
import { DriverPrismaRepo } from "@/infra/prisma/repositories/driver.prisma-repo";
import { PassengerPrismaRepo } from "@/infra/prisma/repositories/passenger.prisma-repo";
import { RedisFaresRepo } from "@/infra/redis/fare.redis-repo";

export interface ContainerDependencies {
  // infra
  prisma: PrismaClient;
  redis: RedisClientType;
  amqp: ChannelModel;
  faresTtl: number;
  receiptDir: string;

  // controllers
  createDriverController: CreateDriverController;
  deleteDriverController: DeleteDriverController;
  getAllDriversController: GetAllDriversController;
  getDriverByIdController: GetDriverByIdController;
  updateDriverController: UpdateDriverController;
  createFareController: CreateFareController;
  createPassengerController: CreatePassengerController;
  deletePassengerController: DeletePassengerController;
  getAllPassengersController: GetAllPassengersController;
  getPassengerByIdController: GetPassengerByIdController;
  updatePassengerController: UpdatePassengerController;
  createTripController: CreateTripController;

  // usecases
  createDriverUseCase: CreateDriverUseCase;
  deleteDriverUseCase: DeleteDriverUseCase;
  getAllDriversUseCase: GetAllDriversUseCase;
  getDriverByIdUseCase: GetDriverByIdUseCase;
  updateDriverUseCase: UpdateDriverUseCase;
  createFareUseCase: CreateFareUseCase;
  createTripUseCase: CreateTripUseCase;
  createPassengerUseCase: CreatePassengerUseCase;
  deletePassengerUseCase: DeletePassengerUseCase;
  getAllPassengersUseCase: GetAllPassengersUseCase;
  getPassengerByIdUseCase: GetPassengerByIdUseCase;
  updatePassengerUseCase: UpdatePassengerUseCase;

  // services and strategies
  farePriceCalculator: FarePriceCalculator;
  weekdaysDaytimeFareStrategy: WeekdaysDaytimeFareStrategy;
  weekdaysEveningFareStrategy: WeekdaysEveningFareStrategy;
  weekdaysNightFareStrategy: WeekdaysNightFareStrategy;
  weekendsDaytimeFareStrategy: WeekendsDaytimeFareStrategy;
  weekendsEveningFareStrategy: WeekendsEveningFareStrategy;
  weekendsNightFareStrategy: WeekendsNightFareStrategy;

  // consumers and publishers
  tripConsumer: TripAmqpConsumer;
  tripNotifier: TripAmqpPublish;

  // repositories
  driverRepository: DriverPrismaRepo;
  passengerRepository: PassengerPrismaRepo;
  fareRepository: RedisFaresRepo;
  tripReceiptRepository: FilesystemTripReceiptRepo;
}

// biome-ignore lint/complexity/noExcessiveLinesPerFunction: yup, big
export function configureContainer(
  prisma: PrismaClient,
  redis: RedisClientType,
  amqp: ChannelModel,
  faresTtl: number,
  receiptDir: string,
) {
  const container = createContainer<ContainerDependencies>({
    injectionMode: InjectionMode.PROXY,
  });

  container.register({
    // infra
    prisma: asValue(prisma),
    redis: asValue(redis),
    amqp: asValue(amqp),
    faresTtl: asValue(faresTtl),
    receiptDir: asValue(receiptDir),

    // repositories
    driverRepository: asFunction(
      ({ prisma }: ContainerDependencies) => new DriverPrismaRepo(prisma),
    ).singleton(),
    passengerRepository: asFunction(
      ({ prisma }: ContainerDependencies) => new PassengerPrismaRepo(prisma),
    ).singleton(),
    fareRepository: asFunction(
      ({ redis, faresTtl }: ContainerDependencies) => new RedisFaresRepo(redis, faresTtl),
    ).singleton(),
    tripReceiptRepository: asFunction(
      ({ receiptDir }: ContainerDependencies) => new FilesystemTripReceiptRepo(receiptDir),
    ).singleton(),

    // strategies
    weekdaysDaytimeFareStrategy: asClass(WeekdaysDaytimeFareStrategy).singleton(),
    weekdaysEveningFareStrategy: asClass(WeekdaysEveningFareStrategy).singleton(),
    weekdaysNightFareStrategy: asClass(WeekdaysNightFareStrategy).singleton(),
    weekendsDaytimeFareStrategy: asClass(WeekendsDaytimeFareStrategy).singleton(),
    weekendsEveningFareStrategy: asClass(WeekendsEveningFareStrategy).singleton(),
    weekendsNightFareStrategy: asClass(WeekendsNightFareStrategy).singleton(),

    // services
    farePriceCalculator: asFunction(
      ({
        weekdaysDaytimeFareStrategy,
        weekdaysEveningFareStrategy,
        weekdaysNightFareStrategy,
        weekendsDaytimeFareStrategy,
        weekendsEveningFareStrategy,
        weekendsNightFareStrategy,
      }: ContainerDependencies) =>
        new FarePriceCalculator([
          weekdaysDaytimeFareStrategy,
          weekdaysEveningFareStrategy,
          weekdaysNightFareStrategy,
          weekendsDaytimeFareStrategy,
          weekendsEveningFareStrategy,
          weekendsNightFareStrategy,
        ]),
    ).singleton(),

    // consumers and publishers (with proper dependency injection)
    tripConsumer: asFunction(
      ({ amqp }: ContainerDependencies) => new TripAmqpConsumer(amqp),
    ).singleton(),
    tripNotifier: asFunction(
      ({ amqp }: ContainerDependencies) => new TripAmqpPublish(amqp),
    ).singleton(),

    // usecases
    createDriverUseCase: asFunction(
      ({ driverRepository }: ContainerDependencies) => new CreateDriverUseCase(driverRepository),
    ).scoped(),
    deleteDriverUseCase: asFunction(
      ({ driverRepository }: ContainerDependencies) => new DeleteDriverUseCase(driverRepository),
    ).scoped(),
    getAllDriversUseCase: asFunction(
      ({ driverRepository }: ContainerDependencies) => new GetAllDriversUseCase(driverRepository),
    ).scoped(),
    getDriverByIdUseCase: asFunction(
      ({ driverRepository }: ContainerDependencies) => new GetDriverByIdUseCase(driverRepository),
    ).scoped(),
    updateDriverUseCase: asFunction(
      ({ driverRepository }: ContainerDependencies) => new UpdateDriverUseCase(driverRepository),
    ).scoped(),
    createPassengerUseCase: asFunction(
      ({ passengerRepository }: ContainerDependencies) =>
        new CreatePassengerUseCase(passengerRepository),
    ).scoped(),
    deletePassengerUseCase: asFunction(
      ({ passengerRepository }: ContainerDependencies) =>
        new DeletePassengerUseCase(passengerRepository),
    ).scoped(),
    getAllPassengersUseCase: asFunction(
      ({ passengerRepository }: ContainerDependencies) =>
        new GetAllPassengersUseCase(passengerRepository),
    ).scoped(),
    getPassengerByIdUseCase: asFunction(
      ({ passengerRepository }: ContainerDependencies) =>
        new GetPassengerByIdUseCase(passengerRepository),
    ).scoped(),
    updatePassengerUseCase: asFunction(
      ({ passengerRepository }: ContainerDependencies) =>
        new UpdatePassengerUseCase(passengerRepository),
    ).scoped(),
    createFareUseCase: asFunction(
      ({ fareRepository, farePriceCalculator }: ContainerDependencies) =>
        new CreateFareUseCase(fareRepository, farePriceCalculator),
    ).scoped(),
    createTripUseCase: asFunction(
      ({ passengerRepository, fareRepository, tripNotifier }: ContainerDependencies) =>
        new CreateTripUseCase(passengerRepository, fareRepository, tripNotifier),
    ).scoped(),

    // controllers
    createDriverController: asFunction(
      ({ createDriverUseCase }: ContainerDependencies) =>
        new CreateDriverController(createDriverUseCase),
    ).scoped(),
    deleteDriverController: asFunction(
      ({ deleteDriverUseCase }: ContainerDependencies) =>
        new DeleteDriverController(deleteDriverUseCase),
    ).scoped(),
    getAllDriversController: asFunction(
      ({ getAllDriversUseCase }: ContainerDependencies) =>
        new GetAllDriversController(getAllDriversUseCase),
    ).scoped(),
    getDriverByIdController: asFunction(
      ({ getDriverByIdUseCase }: ContainerDependencies) =>
        new GetDriverByIdController(getDriverByIdUseCase),
    ).scoped(),
    updateDriverController: asFunction(
      ({ updateDriverUseCase }: ContainerDependencies) =>
        new UpdateDriverController(updateDriverUseCase),
    ).scoped(),
    createPassengerController: asFunction(
      ({ createPassengerUseCase }: ContainerDependencies) =>
        new CreatePassengerController(createPassengerUseCase),
    ).scoped(),
    deletePassengerController: asFunction(
      ({ deletePassengerUseCase }: ContainerDependencies) =>
        new DeletePassengerController(deletePassengerUseCase),
    ).scoped(),
    getAllPassengersController: asFunction(
      ({ getAllPassengersUseCase }: ContainerDependencies) =>
        new GetAllPassengersController(getAllPassengersUseCase),
    ).scoped(),
    getPassengerByIdController: asFunction(
      ({ getPassengerByIdUseCase }: ContainerDependencies) =>
        new GetPassengerByIdController(getPassengerByIdUseCase),
    ).scoped(),
    updatePassengerController: asFunction(
      ({ updatePassengerUseCase }: ContainerDependencies) =>
        new UpdatePassengerController(updatePassengerUseCase),
    ).scoped(),
    createFareController: asFunction(
      ({ createFareUseCase }: ContainerDependencies) => new CreateFareController(createFareUseCase),
    ).scoped(),
    createTripController: asFunction(
      ({ createTripUseCase }: ContainerDependencies) => new CreateTripController(createTripUseCase),
    ).scoped(),
  });

  return container;
}
