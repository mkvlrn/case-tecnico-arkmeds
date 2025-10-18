import "varlock/auto-load";
import process from "node:process";
import { ENV } from "varlock/env";
import { getServer } from "@/adapters/api/server";
import { getAmpq } from "@/infra/amqp/amqp-client";
import { getPrisma } from "@/infra/prisma/prisma-client";
import { getRedis } from "@/infra/redis/redis-client";

const prisma = await getPrisma(ENV.DATABASE_URL);
const redis = await getRedis(ENV.REDIS_URL);
const amqp = await getAmpq(ENV.BROKER_URL);
const server = getServer(prisma, redis, amqp, ENV.FARE_TTL);
// biome-ignore lint/suspicious/noConsole: just for dev
const instance = server.listen(ENV.PORT, () => console.info(`Server is running @${ENV.PORT}`));

async function shutdown() {
  await prisma.$disconnect();
  await redis.quit();
  await amqp.close();
  instance.close(() => process.exit(0));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
