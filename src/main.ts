// biome-ignore lint/correctness/noNodejsModules: for shutdown only
import process from "node:process";
import { ENV } from "varlock/env";
import { getServer } from "@/adapters/api/server";
import { getPrisma } from "@/infra/prisma/client";

const prisma = getPrisma();
const server = getServer(prisma);
// biome-ignore lint/suspicious/noConsole: just for dev
const instance = server.listen(ENV.PORT, () => console.info(`Server is running @${ENV.PORT}`));

async function shutdown() {
  await prisma.$disconnect();
  instance.close(() => process.exit(0));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
