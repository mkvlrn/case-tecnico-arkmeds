import express from "express";
import { errorHandler } from "@/adapters/api/middlewares/error-handler.middleware";
import { getDriversRouter } from "@/adapters/api/routers/drivers.router";
import type { PrismaClient } from "@/generated/prisma/client";

export function getServer(prisma: PrismaClient) {
  const server = express();

  server.use(express.urlencoded({ extended: true }));
  server.use(express.json());
  server.use("/drivers", getDriversRouter(prisma));
  server.use(errorHandler);

  return server;
}
