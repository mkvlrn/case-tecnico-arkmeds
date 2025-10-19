import type { RedisClientType } from "@redis/client";
import type { ChannelModel } from "amqplib";
import type { AwilixContainer } from "awilix";
import { asFunction, asValue } from "awilix";
import type { Logger } from "pino";
import type { PrismaClient } from "@/generated/prisma/client";
import { TripAmqpConsumer } from "@/infra/amqp/trip.amqp-consume";
import { TripAmqpPublish } from "@/infra/amqp/trip.amqp-publish";
import type { AppContainer } from "@/infra/container/types";

export function registerInfrastructure(
  container: AwilixContainer<AppContainer>,
  prisma: PrismaClient,
  redis: RedisClientType,
  amqp: ChannelModel,
  pino: Logger,
  faresTtl: number,
  receiptDir: string,
  apiEnv: "dev" | "prod",
) {
  container.register({
    // external dependencies
    prisma: asValue(prisma),
    redis: asValue(redis),
    amqp: asValue(amqp),
    pino: asValue(pino),
    faresTtl: asValue(faresTtl),
    receiptDir: asValue(receiptDir),
    apiEnv: asValue(apiEnv),

    // messaging
    tripConsumer: asFunction(
      ({ amqp }: AppContainer) => new TripAmqpConsumer(amqp, pino),
    ).singleton(),
    tripNotifier: asFunction(({ amqp }: AppContainer) => new TripAmqpPublish(amqp)).singleton(),
  });
}
