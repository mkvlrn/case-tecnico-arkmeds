import "varlock/auto-load";
import { createClient, type RedisClientType } from "@redis/client";
import { ENV } from "varlock/env";

let redis: RedisClientType | null = null;

export async function getRedis() {
  if (!redis) {
    redis = await createClient({ url: ENV.REDIS_URL }).connect();
  }

  return redis;
}
