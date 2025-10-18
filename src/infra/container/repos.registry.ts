import type { AwilixContainer } from "awilix";
import { asFunction } from "awilix";
import type { AppContainer } from "@/infra/container/types";
import { FilesystemTripReceiptRepo } from "@/infra/fs/trip-receipt.fs-repo";
import { DriverPrismaRepo } from "@/infra/prisma/repositories/driver.prisma-repo";
import { PassengerPrismaRepo } from "@/infra/prisma/repositories/passenger.prisma-repo";
import { RedisFaresRepo } from "@/infra/redis/fare.redis-repo";

export function registerRepositories(container: AwilixContainer<AppContainer>) {
  container.register({
    driverRepository: asFunction(
      ({ prisma }: AppContainer) => new DriverPrismaRepo(prisma),
    ).singleton(),

    passengerRepository: asFunction(
      ({ prisma }: AppContainer) => new PassengerPrismaRepo(prisma),
    ).singleton(),

    fareRepository: asFunction(
      ({ redis, faresTtl }: AppContainer) => new RedisFaresRepo(redis, faresTtl),
    ).singleton(),

    tripReceiptRepository: asFunction(
      ({ receiptDir }: AppContainer) => new FilesystemTripReceiptRepo(receiptDir),
    ).singleton(),
  });
}
