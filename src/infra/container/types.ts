import type { RedisClientType } from "@redis/client";
import type { ChannelModel } from "amqplib";
import type { CreateDriverController } from "@/adapters/api/controllers/drivers/create-driver.controller";
import type { DeleteDriverController } from "@/adapters/api/controllers/drivers/delete-driver.controller";
import type { GetAllDriversController } from "@/adapters/api/controllers/drivers/get-all-drivers.controller";
import type { GetDriverByIdController } from "@/adapters/api/controllers/drivers/get-driver-by-id.controller";
import type { UpdateDriverController } from "@/adapters/api/controllers/drivers/update-driver.controller";
import type { CreateFareController } from "@/adapters/api/controllers/fares/create-fare.controller";
import type { CreatePassengerController } from "@/adapters/api/controllers/passengers/create-passenger.controller";
import type { DeletePassengerController } from "@/adapters/api/controllers/passengers/delete-passenger.controller";
import type { GetAllPassengersController } from "@/adapters/api/controllers/passengers/get-all-passengers.controller";
import type { GetPassengerByIdController } from "@/adapters/api/controllers/passengers/get-passenger-by-id.controller";
import type { UpdatePassengerController } from "@/adapters/api/controllers/passengers/update-passenger.controller";
import type { CreateTripController } from "@/adapters/api/controllers/trips/create-trip.controller";
import type { CreateDriverUseCase } from "@/domain/features/driver/create-driver.usecase";
import type { DeleteDriverUseCase } from "@/domain/features/driver/delete-driver.usecase";
import type { GetAllDriversUseCase } from "@/domain/features/driver/get-all-drivers.usecase";
import type { GetDriverByIdUseCase } from "@/domain/features/driver/get-driver-by-id.usecase";
import type { UpdateDriverUseCase } from "@/domain/features/driver/update-driver.usecase";
import type { CreateFareUseCase } from "@/domain/features/fare/create-fare.usecase";
import type { CreatePassengerUseCase } from "@/domain/features/passenger/create-passenger.usecase";
import type { DeletePassengerUseCase } from "@/domain/features/passenger/delete-passenger.usecase";
import type { GetAllPassengersUseCase } from "@/domain/features/passenger/get-all-passengers.usecase";
import type { GetPassengerByIdUseCase } from "@/domain/features/passenger/get-passenger-by-id.usecase";
import type { UpdatePassengerUseCase } from "@/domain/features/passenger/update-passenger.usecase";
import type { CreateTripUseCase } from "@/domain/features/trip/create-trip.usecase";
import type { FarePriceCalculator } from "@/domain/services/fare-price-calculator";
import type { WeekdaysDaytimeFareStrategy } from "@/domain/strategies/weekdays-daytime";
import type { WeekdaysEveningFareStrategy } from "@/domain/strategies/weekdays-evening";
import type { WeekdaysNightFareStrategy } from "@/domain/strategies/weekdays-night";
import type { WeekendsDaytimeFareStrategy } from "@/domain/strategies/weekends-daytime";
import type { WeekendsEveningFareStrategy } from "@/domain/strategies/weekends-evening";
import type { WeekendsNightFareStrategy } from "@/domain/strategies/weekends-night";
import type { PrismaClient } from "@/generated/prisma/client";
import type { TripAmqpConsumer } from "@/infra/amqp/trip.amqp-consume";
import type { TripAmqpPublish } from "@/infra/amqp/trip.amqp-publish";
import type { FilesystemTripReceiptRepo } from "@/infra/fs/trip-receipt.fs-repo";
import type { DriverPrismaRepo } from "@/infra/prisma/repositories/driver.prisma-repo";
import type { PassengerPrismaRepo } from "@/infra/prisma/repositories/passenger.prisma-repo";
import type { RedisFaresRepo } from "@/infra/redis/fare.redis-repo";

export interface AppContainer {
  // infra
  prisma: PrismaClient;
  redis: RedisClientType;
  amqp: ChannelModel;
  faresTtl: number;
  receiptDir: string;

  // repositories
  driverRepository: DriverPrismaRepo;
  passengerRepository: PassengerPrismaRepo;
  fareRepository: RedisFaresRepo;
  tripReceiptRepository: FilesystemTripReceiptRepo;

  // strategies
  weekdaysDaytimeFareStrategy: WeekdaysDaytimeFareStrategy;
  weekdaysEveningFareStrategy: WeekdaysEveningFareStrategy;
  weekdaysNightFareStrategy: WeekdaysNightFareStrategy;
  weekendsDaytimeFareStrategy: WeekendsDaytimeFareStrategy;
  weekendsEveningFareStrategy: WeekendsEveningFareStrategy;
  weekendsNightFareStrategy: WeekendsNightFareStrategy;

  // services
  farePriceCalculator: FarePriceCalculator;

  // messaging
  tripConsumer: TripAmqpConsumer;
  tripNotifier: TripAmqpPublish;

  // driver usecases
  createDriverUseCase: CreateDriverUseCase;
  deleteDriverUseCase: DeleteDriverUseCase;
  getAllDriversUseCase: GetAllDriversUseCase;
  getDriverByIdUseCase: GetDriverByIdUseCase;
  updateDriverUseCase: UpdateDriverUseCase;

  // passenger usecases
  createPassengerUseCase: CreatePassengerUseCase;
  deletePassengerUseCase: DeletePassengerUseCase;
  getAllPassengersUseCase: GetAllPassengersUseCase;
  getPassengerByIdUseCase: GetPassengerByIdUseCase;
  updatePassengerUseCase: UpdatePassengerUseCase;

  // fare and trip usecases
  createFareUseCase: CreateFareUseCase;
  createTripUseCase: CreateTripUseCase;

  // driver controllers
  createDriverController: CreateDriverController;
  deleteDriverController: DeleteDriverController;
  getAllDriversController: GetAllDriversController;
  getDriverByIdController: GetDriverByIdController;
  updateDriverController: UpdateDriverController;

  // passenger controllers
  createPassengerController: CreatePassengerController;
  deletePassengerController: DeletePassengerController;
  getAllPassengersController: GetAllPassengersController;
  getPassengerByIdController: GetPassengerByIdController;
  updatePassengerController: UpdatePassengerController;

  // fare and trip controllers
  createFareController: CreateFareController;
  createTripController: CreateTripController;
}
