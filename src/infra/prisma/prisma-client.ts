import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

let prisma: PrismaClient | null = null;

export async function getPrisma(connectionString: string) {
  if (!prisma) {
    prisma = new PrismaClient({
      adapter: new PrismaPg({ connectionString }),
    });
  }

  await prisma.$connect();

  return prisma;
}
