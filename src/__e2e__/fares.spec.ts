import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";
import type { RedisClientType } from "@redis/client";
import { RedisContainer, type StartedRedisContainer } from "@testcontainers/redis";
import { StatusCodes } from "http-status-codes";
import { mockDeep } from "jest-mock-extended";
import supertest, { type Agent } from "supertest";
import { createFare } from "@/__e2e__/fixtures/fares/create-fare.fixtures";
import { getServer } from "@/adapters/api/server";
import type { PrismaClient } from "@/generated/prisma/client";
import { getRedis } from "@/infra/redis/redis-client";

const TEST_HOOK_TIMEOUT = 30_000;

let db: StartedRedisContainer;
let redis: RedisClientType;
let server: Agent;

beforeAll(async () => {
  db = await new RedisContainer("redis:alpine").start();
  redis = await getRedis(db.getConnectionUrl());
  server = supertest(getServer(mockDeep<PrismaClient>(), redis));
}, TEST_HOOK_TIMEOUT);

afterAll(async () => {
  await redis.quit();
  await db.stop();
});

describe("POST /fares", () => {
  test("should create a fare", async () => {
    const response = await server
      .post("/fares")
      .set("Content-Type", "application/json")
      .send(JSON.stringify(createFare.success.input));

    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.body).toMatchObject(createFare.success.output);
  });

  test.each(createFare.fail)("should fail on $spec", async ({ input, error, statusCode }) => {
    const response = await server
      .post("/fares")
      .set("Content-Type", "application/json")
      .send(JSON.stringify(input));

    expect(response.status).toStrictEqual(statusCode);
    expect(response.body).toStrictEqual(error);
  });
});
