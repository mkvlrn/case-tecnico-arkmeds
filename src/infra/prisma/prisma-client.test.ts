import { afterEach, expect, jest, test } from "@jest/globals";
import { getPrisma } from "./prisma-client";

jest.mock("@/generated/prisma/client");
jest.mock("@prisma/adapter-pg");

const mockUrl = "postgresql://localhost:5432/db";

afterEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

test("should return the same Prisma client instance on subsequent calls", async () => {
  const prisma1 = await getPrisma(mockUrl);
  const prisma2 = await getPrisma(mockUrl);

  expect(prisma1).toBe(prisma2);
});
