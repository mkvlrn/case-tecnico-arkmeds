import "varlock/auto-load";
import process from "node:process";
import { ENV } from "varlock/env";
import { getServer } from "@/adapters/api/server";
import { getAmpq } from "@/infra/amqp/amqp-client";
import { configureContainer } from "@/infra/container/index";
import { getPino } from "@/infra/pino/pino-logger";
import { getPrisma } from "@/infra/prisma/prisma-client";
import { getRedis } from "@/infra/redis/redis-client";

const pino = getPino();
const prisma = await getPrisma(ENV.DATABASE_URL);
const redis = await getRedis(ENV.REDIS_URL);
const amqp = await getAmpq(ENV.BROKER_URL, pino);

const container = configureContainer(
  prisma,
  redis,
  amqp,
  pino,
  ENV.FARE_TTL,
  ENV.RECEIPT_DIR,
  ENV.API_ENV,
);

const { tripConsumer, tripReceiptRepository } = container.cradle;
await tripConsumer.consume(async (trip) => {
  await tripReceiptRepository.save(trip);
});

const server = getServer(container);
const instance = server.listen(ENV.PORT, () => {
  pino.info(`server is running @${ENV.PORT}`);
  if (ENV.API_ENV === "dev") {
    pino.info(`view docs at http://localhost:${ENV.PORT}/docs`);
  }
});

async function shutdown() {
  await prisma.$disconnect();
  await redis.quit();
  await amqp.close();
  instance.close(() => process.exit(0));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
