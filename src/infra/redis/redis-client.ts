import { createClient, type RedisClientType } from "@redis/client";

let redis: RedisClientType | null = null;

export async function getRedis(url: string) {
  if (!redis) {
    redis = createClient({ url });
  }

  await redis.connect();

  return redis;
}
