import type { RedisClientType } from "@redis/client";
import type { ChannelModel } from "amqplib";
import express from "express";
import { errorHandler } from "@/adapters/api/middlewares/error-handler.middleware";
import { getDriversRouter } from "@/adapters/api/routers/drivers.router";
import { getFaresRouter } from "@/adapters/api/routers/fares.router";
import { getPassengersRouter } from "@/adapters/api/routers/passengers.router";
import { getTripsRouter } from "@/adapters/api/routers/trips.router";
import type { PrismaClient } from "@/generated/prisma/client";

export function getServer(
  prisma: PrismaClient,
  redis: RedisClientType,
  amqp: ChannelModel,
  faresTtl: number,
) {
  const server = express();

  server.use(express.urlencoded({ extended: true }));
  server.use(express.json());
  server.use("/drivers", getDriversRouter(prisma));
  server.use("/passengers", getPassengersRouter(prisma));
  server.use("/fares", getFaresRouter(redis, faresTtl));
  server.use("/trips", getTripsRouter(prisma, redis, amqp, faresTtl));
  server.use(errorHandler);

  return server;
}
