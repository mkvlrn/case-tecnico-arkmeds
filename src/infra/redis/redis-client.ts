import { createClient, type RedisClientType } from "@redis/client";

let redis: RedisClientType | null = null;

export async function getRedis(url: string) {
  if (!redis) {
    redis = createClient({ url });
  }

  if (!redis.isOpen) {
    await redis.connect();
  }

  return redis;
}
