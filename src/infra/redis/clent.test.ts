import { expect, jest, test } from "@jest/globals";
import { getRedis } from "@/infra/redis/client";

jest.mock("varlock/auto-load");
jest.mock("varlock/env");
jest.mock("@redis/client");

test("should create a RedisClientType instance", async () => {
  const redis = await getRedis();

  expect(redis).toBeDefined();
  expect(redis).not.toBeNull();
});

test("should return the same instance on subsequent calls (singleton pattern)", async () => {
  const firstCall = await getRedis();
  const secondCall = await getRedis();
  const thirdCall = await getRedis();

  expect(firstCall).toBe(secondCall);
  expect(secondCall).toBe(thirdCall);
  expect(firstCall).toBe(thirdCall);
});
