import type { RedisClientType } from "@redis/client";
import type { ChannelModel } from "amqplib";
import { CreateTripController } from "@/adapters/api/controllers/trips/create-trip.controller";
import { createCrudRouter } from "@/adapters/api/factories/crud-router.factory";
import { CreateTripSchema } from "@/adapters/api/validation-schemas/trip.schema";
import { CreateTripUseCase } from "@/domain/features/trip/create-trip.usecase";
import type { PrismaClient } from "@/generated/prisma/client";
import { TripAmqpPublish } from "@/infra/amqp/trip.amqp-publish";
import { PassengerPrismaRepo } from "@/infra/prisma/repositories/passenger.prisma-repo";
import { RedisFaresRepo } from "@/infra/redis/fare.redis-repo";

export function getTripsRouter(
  prisma: PrismaClient,
  redis: RedisClientType,
  amqp: ChannelModel,
  fareTtl: number,
) {
  const passengerRepo = new PassengerPrismaRepo(prisma);
  const fareRepo = new RedisFaresRepo(redis, fareTtl);
  const tripNotifier = new TripAmqpPublish(amqp);

  return createCrudRouter(
    {
      create: new CreateTripController(
        new CreateTripUseCase(passengerRepo, fareRepo, tripNotifier),
      ),
    },
    CreateTripSchema,
  );
}
