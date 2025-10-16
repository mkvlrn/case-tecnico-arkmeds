import "varlock/auto-load";
import { PrismaPg } from "@prisma/adapter-pg";
import { ENV } from "varlock/env";
import { PrismaClient } from "@/generated/prisma/client";

export function getPrisma() {
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: ENV.DATABASE_URL }),
  });
}
