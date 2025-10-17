import { expect, jest, test } from "@jest/globals";
import { getPrisma } from "@/infra/prisma/client";

jest.mock("varlock/auto-load");
jest.mock("varlock/env");
jest.mock("@prisma/adapter-pg");
jest.mock("@/generated/prisma/client");

test("should create a PrismaClient instance", () => {
  const prisma = getPrisma();

  expect(prisma).toBeDefined();
  expect(prisma).not.toBeNull();
});

test("should return the same instance on subsequent calls (singleton pattern)", () => {
  const firstCall = getPrisma();
  const secondCall = getPrisma();
  const thirdCall = getPrisma();

  expect(firstCall).toBe(secondCall);
  expect(secondCall).toBe(thirdCall);
  expect(firstCall).toBe(thirdCall);
});
