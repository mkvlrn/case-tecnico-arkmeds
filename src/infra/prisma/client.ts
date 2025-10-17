import "varlock/auto-load";
import { PrismaPg } from "@prisma/adapter-pg";
import { ENV } from "varlock/env";
import { PrismaClient } from "@/generated/prisma/client";

let prisma: PrismaClient | null = null;

export function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient({
      adapter: new PrismaPg({ connectionString: ENV.DATABASE_URL }),
    });
  }

  return prisma;
}
