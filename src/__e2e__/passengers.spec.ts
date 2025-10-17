import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";
import { PrismaPg } from "@prisma/adapter-pg";
import type { RedisClientType } from "@redis/client";
import { PostgreSqlContainer, type StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { StatusCodes } from "http-status-codes";
import { mockDeep } from "jest-mock-extended";
import supertest, { type Agent } from "supertest";
import { createPassenger } from "@/__e2e__/fixtures/passengers/create-passenger.fixtures";
import { deletePassenger } from "@/__e2e__/fixtures/passengers/delete-passenger.fixtures";
import { getAllPassengers } from "@/__e2e__/fixtures/passengers/get-all-passengers.fixtures";
import { getPassengerById } from "@/__e2e__/fixtures/passengers/get-passenger-by-id.fixtures";
import { updatePassenger } from "@/__e2e__/fixtures/passengers/update-passenger.fixtures";
import { init, seed } from "@/__e2e__/setup";
import { getServer } from "@/adapters/api/server";
import { PrismaClient } from "@/generated/prisma/client";

const TEST_HOOK_TIMEOUT = 30_000;

let db: StartedPostgreSqlContainer;
let prisma: PrismaClient;
let server: Agent;

beforeAll(async () => {
  db = await new PostgreSqlContainer("postgres:alpine").start();
  const prismaPg = new PrismaPg({ connectionString: db.getConnectionUri() });
  prisma = new PrismaClient({ adapter: prismaPg });
  init(db.getConnectionUri());
  await seed(prisma);
  server = supertest(getServer(prisma, mockDeep<RedisClientType>()));
}, TEST_HOOK_TIMEOUT);

afterAll(async () => {
  await prisma.$disconnect();
  await db.stop();
});

describe("POST /passengers", () => {
  test("should create a passenger", async () => {
    const response = await server
      .post("/passengers")
      .set("Content-Type", "application/json")
      .send(JSON.stringify(createPassenger.success.input));

    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.body).toStrictEqual(createPassenger.success.output);
  });

  test.each(createPassenger.fail)("should fail on $spec", async ({ input, error, statusCode }) => {
    const response = await server
      .post("/passengers")
      .set("Content-Type", "application/json")
      .send(JSON.stringify(input));

    expect(response.status).toStrictEqual(statusCode);
    expect(response.body).toStrictEqual(error);
  });
});

describe("GET /passengers", () => {
  test.each(getAllPassengers.success)(
    "should get all passengers - $spec",
    async ({ query, output }) => {
      const response = await server.get("/passengers").query(query);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toMatchObject(output);
    },
  );

  test.each(getAllPassengers.fail)("should fail on $spec", async ({ query, error, statusCode }) => {
    const response = await server.get("/passengers").query(query);

    expect(response.status).toStrictEqual(statusCode);
    expect(response.body).toStrictEqual(error);
  });
});

describe("GET /passengers/:id", () => {
  test("should get an existing passenger", async () => {
    const response = await server
      .get("/passengers/okmclejrj1xegofrbc164ie0")
      .set("Content-Type", "application/json");

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toStrictEqual(getPassengerById.success.output);
  });

  test("should receive 404 when passenger does not exist", async () => {
    const response = await server
      .get("/passengers/very-wrong-id")
      .set("Content-Type", "application/json");

    expect(response.status).toBe(StatusCodes.NOT_FOUND);
    expect(response.body).toStrictEqual(getPassengerById.fail.error);
  });
});

describe("PUT /passengers/:id", () => {
  test("should update an existing passenger", async () => {
    const response = await server
      .put(`/passengers/${updatePassenger.success.id}`)
      .set("Content-Type", "application/json")
      .send(JSON.stringify(updatePassenger.success.input));

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toStrictEqual(updatePassenger.success.output);
  });

  test.each(updatePassenger.fail)(
    "should fail on $spec",
    async ({ id, input, error, statusCode }) => {
      const response = await server
        .put(`/passengers/${id}`)
        .set("Content-Type", "application/json")
        .send(JSON.stringify(input));

      expect(response.status).toStrictEqual(statusCode);
      expect(response.body).toStrictEqual(error);
    },
  );
});

describe("DELETE /passengers/:id", () => {
  test("should delete an existing passenger", async () => {
    const response = await server
      .delete(`/passengers/${deletePassenger.success.id}`)
      .set("Content-Type", "application/json");

    expect(response.status).toBe(StatusCodes.NO_CONTENT);
    expect(response.body).toStrictEqual({});
  });

  test("should receive 404 when passenger does not exist", async () => {
    const response = await server
      .delete("/passengers/very-wrong-id")
      .set("Content-Type", "application/json");

    expect(response.status).toBe(StatusCodes.NOT_FOUND);
    expect(response.body).toStrictEqual(deletePassenger.fail.error);
  });
});
