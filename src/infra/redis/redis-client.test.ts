import { afterEach, expect, jest, test } from "@jest/globals";
import type { RedisClientType } from "@redis/client";
import { mock } from "jest-mock-extended";

const mockRedisClient = mock<RedisClientType>();
jest.unstable_mockModule("@redis/client", () => ({
  createClient: jest.fn().mockReturnValue(mockRedisClient),
}));

const mockUrl = "redis://localhost:9999";

afterEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

test("should return the same Redis client instance on subsequent calls", async () => {
  const { getRedis } = await import("@/infra/redis/redis-client");

  const redis1 = await getRedis(mockUrl);
  const redis2 = await getRedis(mockUrl);

  expect(redis1).toBe(redis2);
});
