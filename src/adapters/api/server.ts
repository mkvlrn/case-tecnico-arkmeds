import { apiReference } from "@scalar/express-api-reference";
import type { AwilixContainer } from "awilix";
import express, { type Application } from "express";
import { errorHandler } from "@/adapters/api/middlewares/error-handler.middleware";
import { getDriversRouter } from "@/adapters/api/routers/drivers.router";
import { getFaresRouter } from "@/adapters/api/routers/fares.router";
import { getPassengersRouter } from "@/adapters/api/routers/passengers.router";
import { getTripsRouter } from "@/adapters/api/routers/trips.router";
import type { AppContainer } from "@/infra/container/types";

export function getServer(container: AwilixContainer<AppContainer>): Application {
  const server = express();

  server.use(express.urlencoded({ extended: true }));
  server.use(express.json());

  server.use(
    "/docs",
    apiReference({
      url: "/openapi.json",
      theme: "moon",
      layout: "modern",
      darkMode: true,
      hideModels: true,
      hideClientButton: true,
    }),
  );
  server.get("/openapi.json", (_req, res) => {
    res.sendFile("openapi.json", { root: "." });
  });

  server.use("/drivers", getDriversRouter(container));
  server.use("/passengers", getPassengersRouter(container));
  server.use("/fares", getFaresRouter(container));
  server.use("/trips", getTripsRouter(container));

  server.use(errorHandler);

  return server;
}
