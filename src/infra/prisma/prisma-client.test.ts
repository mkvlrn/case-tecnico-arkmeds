import { afterEach, expect, jest, test } from "@jest/globals";
import { getPrisma } from "./prisma-client";

jest.mock("@/generated/prisma/client");
jest.mock("@prisma/adapter-pg");

afterEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

test("should return the same Prisma client instance on subsequent calls", async () => {
  const prisma1 = await getPrisma("postgresql://localhost:5432/db");
  const prisma2 = await getPrisma("postgresql://localhost:5432/db");

  expect(prisma1).toBe(prisma2);
});
