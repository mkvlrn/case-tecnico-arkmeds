import "varlock/auto-load";
import process from "node:process";
import { ENV } from "varlock/env";
import { getServer } from "@/adapters/api/server";
import { getAmpq } from "@/infra/amqp/amqp-client";
import { TripAmqpConsumer } from "@/infra/amqp/trip.amqp-consume";
import { FilesystemTripReceiptRepo } from "@/infra/fs/trip-receipt.fs-repo";
import { getPrisma } from "@/infra/prisma/prisma-client";
import { getRedis } from "@/infra/redis/redis-client";

const prisma = await getPrisma(ENV.DATABASE_URL);
const redis = await getRedis(ENV.REDIS_URL);
const amqp = await getAmpq(ENV.BROKER_URL);

const tripConsumer = new TripAmqpConsumer(amqp);
const fsRepo = new FilesystemTripReceiptRepo("./tmp");
await tripConsumer.consume(async (trip) => {
  await fsRepo.save(trip);
});

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
