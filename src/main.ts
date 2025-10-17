import process from "node:process";
import { ENV } from "varlock/env";
import { getServer } from "@/adapters/api/server";
import { getPrisma } from "@/infra/prisma/client";
import { getRedis } from "@/infra/redis/client";

const prisma = getPrisma();
const redis = await getRedis();
const server = getServer(prisma, redis);
// biome-ignore lint/suspicious/noConsole: just for dev
const instance = server.listen(ENV.PORT, () => console.info(`Server is running @${ENV.PORT}`));

async function shutdown() {
  await prisma.$disconnect();
  redis.destroy();
  instance.close(() => process.exit(0));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
