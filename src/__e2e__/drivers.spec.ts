import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";
import type { RedisClientType } from "@redis/client";
import { PostgreSqlContainer, type StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import type { ChannelModel } from "amqplib";
import { StatusCodes } from "http-status-codes";
import { mockDeep } from "jest-mock-extended";
import supertest, { type Agent } from "supertest";
import { createDriver } from "@/__e2e__/fixtures/drivers/create-driver.fixtures";
import { deleteDriver } from "@/__e2e__/fixtures/drivers/delete-driver.fixtures";
import { getAllDrivers } from "@/__e2e__/fixtures/drivers/get-all-drivers.fixtures";
import { getDriverById } from "@/__e2e__/fixtures/drivers/get-driver-by-id.fixtures";
import { updateDriver } from "@/__e2e__/fixtures/drivers/update-driver.fixtures";
import { init, seed } from "@/__e2e__/setup";
import { getServer } from "@/adapters/api/server";
import type { PrismaClient } from "@/generated/prisma/client";
import { configureContainer } from "@/infra/container";
import { getPrisma } from "@/infra/prisma/prisma-client";

const TEST_HOOK_TIMEOUT = 30_000;

let db: StartedPostgreSqlContainer;
let prisma: PrismaClient;
let server: Agent;

beforeAll(async () => {
  db = await new PostgreSqlContainer("postgres:alpine").start();
  prisma = await getPrisma(db.getConnectionUri());
  init(db.getConnectionUri());
  await seed(prisma);
  const container = configureContainer(
    prisma,
    mockDeep<RedisClientType>(),
    mockDeep<ChannelModel>(),
    0,
    "./tmp",
  );
  server = supertest(getServer(container));
}, TEST_HOOK_TIMEOUT);

afterAll(async () => {
  await prisma.$disconnect();
  await db.stop();
});

describe("POST /drivers", () => {
  test("should create a driver", async () => {
    const response = await server
      .post("/drivers")
      .set("Content-Type", "application/json")
      .send(JSON.stringify(createDriver.success.input));

    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.body).toStrictEqual(createDriver.success.output);
  });

  test.each(createDriver.fail)("should fail on $spec", async ({ input, error, statusCode }) => {
    const response = await server
      .post("/drivers")
      .set("Content-Type", "application/json")
      .send(JSON.stringify(input));

    expect(response.status).toStrictEqual(statusCode);
    expect(response.body).toStrictEqual(error);
  });
});

describe("GET /drivers", () => {
  test.each(getAllDrivers.success)("should get all drivers - $spec", async ({ query, output }) => {
    const response = await server.get("/drivers").query(query);

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toMatchObject(output);
  });

  test.each(getAllDrivers.fail)("should fail on $spec", async ({ query, error, statusCode }) => {
    const response = await server.get("/drivers").query(query);

    expect(response.status).toStrictEqual(statusCode);
    expect(response.body).toStrictEqual(error);
  });
});

describe("GET /drivers/:id", () => {
  test("should get an existing driver", async () => {
    const response = await server
      .get("/drivers/okmclejrj1xegofrbc164ie0")
      .set("Content-Type", "application/json");

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toStrictEqual(getDriverById.success.output);
  });

  test("should receive 404 when driver does not exist", async () => {
    const response = await server
      .get("/drivers/very-wrong-id")
      .set("Content-Type", "application/json");

    expect(response.status).toBe(StatusCodes.NOT_FOUND);
    expect(response.body).toStrictEqual(getDriverById.fail.error);
  });
});

describe("PUT /drivers/:id", () => {
  test("should update an existing driver", async () => {
    const response = await server
      .put(`/drivers/${updateDriver.success.id}`)
      .set("Content-Type", "application/json")
      .send(JSON.stringify(updateDriver.success.input));

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toStrictEqual(updateDriver.success.output);
  });

  test.each(updateDriver.fail)("should fail on $spec", async ({ id, input, error, statusCode }) => {
    const response = await server
      .put(`/drivers/${id}`)
      .set("Content-Type", "application/json")
      .send(JSON.stringify(input));

    expect(response.status).toStrictEqual(statusCode);
    expect(response.body).toStrictEqual(error);
  });
});

describe("DELETE /drivers/:id", () => {
  test("should delete an existing driver", async () => {
    const response = await server
      .delete(`/drivers/${deleteDriver.success.id}`)
      .set("Content-Type", "application/json");

    expect(response.status).toBe(StatusCodes.NO_CONTENT);
    expect(response.body).toStrictEqual({});
  });

  test("should receive 404 when driver does not exist", async () => {
    const response = await server
      .delete("/drivers/very-wrong-id")
      .set("Content-Type", "application/json");

    expect(response.status).toBe(StatusCodes.NOT_FOUND);
    expect(response.body).toStrictEqual(deleteDriver.fail.error);
  });
});
