import { readFile, rm } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";
import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";
import type { RedisClientType } from "@redis/client";
import { PostgreSqlContainer, type StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { RabbitMQContainer, type StartedRabbitMQContainer } from "@testcontainers/rabbitmq";
import { RedisContainer, type StartedRedisContainer } from "@testcontainers/redis";
import type { ChannelModel } from "amqplib";
import { StatusCodes } from "http-status-codes";
import supertest, { type Agent } from "supertest";
import { createTrip } from "@/__e2e__/fixtures/trips/create-trip.fixtures";
import { init, seed } from "@/__e2e__/setup";
import { getServer } from "@/adapters/api/server";
import type { Fare } from "@/domain/features/fare/fare.model";
import type { Trip } from "@/domain/features/trip/trip.model";
import type { PrismaClient } from "@/generated/prisma/client";
import { getAmpq } from "@/infra/amqp/amqp-client";
import { configureContainer } from "@/infra/container/index";
import { getPrisma } from "@/infra/prisma/prisma-client";
import { getRedis } from "@/infra/redis/redis-client";

const TEST_HOOK_TIMEOUT = 60_000;
const TEST_TTL = 600;
const TEST_RECEIPT_DIR = join(process.cwd(), "tmp-e2e");

let postgresDb: StartedPostgreSqlContainer;
let redisDb: StartedRedisContainer;
let rabbitDb: StartedRabbitMQContainer;
let prisma: PrismaClient;
let redis: RedisClientType;
let amqp: ChannelModel;
let server: Agent;

beforeAll(async () => {
  [postgresDb, redisDb, rabbitDb] = await Promise.all([
    new PostgreSqlContainer("postgres:alpine").start(),
    new RedisContainer("redis:alpine").start(),
    new RabbitMQContainer("rabbitmq:alpine").start(),
  ]);

  prisma = await getPrisma(postgresDb.getConnectionUri());
  redis = await getRedis(redisDb.getConnectionUrl());
  amqp = await getAmpq(rabbitDb.getAmqpUrl());

  init(postgresDb.getConnectionUri());
  await seed(prisma);

  const container = configureContainer(prisma, redis, amqp, TEST_TTL, TEST_RECEIPT_DIR);

  // start the consumer to save receipts
  const { tripConsumer, tripReceiptRepository } = container.cradle;
  await tripConsumer.consume(async (trip) => {
    await tripReceiptRepository.save(trip);
  });

  const testFare: Fare = {
    requestId: "test-fare-request-id-123",
    originLatitude: 40.7128,
    originLongitude: -74.006,
    destinationLatitude: 34.0522,
    destinationLongitude: -118.2437,
    datetime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    distanceInKm: 4500,
    price: 2250.0,
  };

  await redis.set(testFare.requestId, JSON.stringify(testFare), {
    expiration: { type: "EX", value: TEST_TTL },
  });

  server = supertest(getServer(container));
}, TEST_HOOK_TIMEOUT);

afterAll(async () => {
  await prisma.$disconnect();
  await redis.quit();
  await amqp.close();
  await postgresDb.stop();
  await redisDb.stop();
  await rabbitDb.stop();
  await rm(TEST_RECEIPT_DIR, { recursive: true, force: true });
}, TEST_HOOK_TIMEOUT);

describe("POST /trips", () => {
  test(
    "should create a trip, send notification to RabbitMQ, and create receipt file",
    async () => {
      const response = await server
        .post("/trips")
        .set("Content-Type", "application/json")
        .send(JSON.stringify(createTrip.success.input));

      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.body).toMatchObject(createTrip.success.output);

      // wait for async receipt creation to complete (consumer processes RabbitMQ message)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // verify receipt file was created (proves message was sent and consumed)
      const tripDate = new Date(response.body.datetime);
      const yyyymmdd = tripDate.toISOString().slice(0, 10);
      const hhmmss = tripDate.toISOString().slice(11, 19).replaceAll(":", "_");
      const filename = `${hhmmss}.txt`;
      const filepath = join(
        TEST_RECEIPT_DIR,
        createTrip.success.input.passengerId,
        yyyymmdd,
        filename,
      );

      const receiptContent = await readFile(filepath, "utf-8");
      const receipt = JSON.parse(receiptContent) as Trip;

      expect(receipt).toMatchObject({
        passengerId: createTrip.success.input.passengerId,
        datetime: tripDate.toISOString(),
        distanceInKm: expect.any(Number),
        price: expect.any(Number),
      });

      // verify file structure matches expected format (2-space indentation)
      // biome-ignore lint/performance/useTopLevelRegex: single regex, it's fine
      expect(receiptContent).toMatch(/\{\n {2}"passengerId":/);
    },
    TEST_HOOK_TIMEOUT,
  );

  test.each(createTrip.fail)("should fail on $spec", async ({ input, error, statusCode }) => {
    const response = await server
      .post("/trips")
      .set("Content-Type", "application/json")
      .send(JSON.stringify(input));

    expect(response.status).toStrictEqual(statusCode);
    expect(response.body).toStrictEqual(error);
  });
});
