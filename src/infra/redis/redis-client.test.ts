import { afterEach, expect, jest, test } from "@jest/globals";
import { createClient } from "@redis/client";
import { getRedis } from "@/infra/redis/redis-client";

const mockUrl = "redis://localhost:9999";

afterEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

test("should return the same Redis client instance on subsequent calls", async () => {
  const redis1 = await getRedis(mockUrl);
  const redis2 = await getRedis(mockUrl);

  expect(redis1).toBe(redis2);
  expect(createClient).toHaveBeenCalledTimes(1);
});
