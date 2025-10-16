import assert from "node:assert/strict";
import { beforeEach, describe, expect, test } from "@jest/globals";
import { type DeepMockProxy, mockDeep } from "jest-mock-extended";
import { validDriverInput, validDriverOutput } from "@/domain/__fixtures";
import { AppError } from "@/domain/utils/app-error";
import type { PrismaClient } from "@/generated/prisma/client";
import { DriverPrismaRepo } from "@/infra/prisma/repositories/driver.prisma-repo";

let prisma: DeepMockProxy<PrismaClient>;
let repo: DriverPrismaRepo;

beforeEach(() => {
  prisma = mockDeep<PrismaClient>();
  repo = new DriverPrismaRepo(prisma);
});

describe("create", () => {
  test("should create and return a valid driver", async () => {
    prisma.driver.create.mockResolvedValue({
      ...validDriverOutput,
      dateOfBirth: new Date(validDriverOutput.dateOfBirth),
    });

    const result = await repo.create(validDriverInput);

    assert(result.isOk);
    expect(result.value).toStrictEqual(validDriverOutput);
  });

  test("should return error if prisma throws", async () => {
    prisma.driver.create.mockRejectedValue(new Error("test error"));

    const result = await repo.create(validDriverOutput);

    assert(result.isError);
    expect(result.error).toBeInstanceOf(AppError);
    expect(result.error.message).toBe("test error");
    expect(result.error.code).toBe("databaseError");
  });
});

describe("getAll", () => {
  test("should return drivers", async () => {
    prisma.driver.findMany.mockResolvedValue([
      {
        ...validDriverOutput,
        dateOfBirth: new Date(validDriverOutput.dateOfBirth),
      },
    ]);

    const result = await repo.getAll(1);

    assert(result.isOk);
    expect(result.value).toStrictEqual([validDriverOutput]);
  });

  test("should return error if prisma throws", async () => {
    prisma.driver.findMany.mockRejectedValue(new Error("test error"));

    const result = await repo.getAll(1);

    assert(result.isError);
    expect(result.error).toBeInstanceOf(AppError);
    expect(result.error.message).toBe("test error");
    expect(result.error.code).toBe("databaseError");
  });
});

describe("getById", () => {
  test("should return a driver by a given id", async () => {
    prisma.driver.findUnique.mockResolvedValue({
      ...validDriverOutput,
      dateOfBirth: new Date(validDriverOutput.dateOfBirth),
    });

    const result = await repo.getById("test-id");

    assert(result.isOk);
    expect(result.value).toStrictEqual(validDriverOutput);
  });

  test("should return null normally", async () => {
    prisma.driver.findUnique.mockResolvedValue(null);

    const result = await repo.getById("test-id");

    assert(result.isOk);
    expect(result.value).toBeNull();
  });

  test("should return error if prisma throws", async () => {
    prisma.driver.findUnique.mockRejectedValue(new Error("test error"));

    const result = await repo.getById("test-id");

    assert(result.isError);
    expect(result.error).toBeInstanceOf(AppError);
    expect(result.error.message).toBe("test error");
    expect(result.error.code).toBe("databaseError");
  });
});

describe("getByCpf", () => {
  test("should return a driver by a given cpf", async () => {
    prisma.driver.findUnique.mockResolvedValue({
      ...validDriverOutput,
      dateOfBirth: new Date(validDriverOutput.dateOfBirth),
    });

    const result = await repo.getByCpf("test-cpf");

    assert(result.isOk);
    expect(result.value).toStrictEqual(validDriverOutput);
  });

  test("should return null normally", async () => {
    prisma.driver.findUnique.mockResolvedValue(null);

    const result = await repo.getByCpf("test-cpf");

    assert(result.isOk);
    expect(result.value).toBeNull();
  });

  test("should return error if prisma throws", async () => {
    prisma.driver.findUnique.mockRejectedValue(new Error("test error"));

    const result = await repo.getByCpf("test-cpf");

    assert(result.isError);
    expect(result.error).toBeInstanceOf(AppError);
    expect(result.error.message).toBe("test error");
    expect(result.error.code).toBe("databaseError");
  });
});

describe("update", () => {
  test("should update and return a valid driver", async () => {
    prisma.driver.update.mockResolvedValue({
      ...validDriverOutput,
      dateOfBirth: new Date(validDriverOutput.dateOfBirth),
    });

    const result = await repo.update("test-id", validDriverInput);

    assert(result.isOk);
    expect(result.value).toStrictEqual(validDriverOutput);
  });

  test("should return error if prisma throws", async () => {
    prisma.driver.update.mockRejectedValue(new Error("test error"));

    const result = await repo.update("test-id", validDriverInput);

    assert(result.isError);
    expect(result.error).toBeInstanceOf(AppError);
    expect(result.error.message).toBe("test error");
    expect(result.error.code).toBe("databaseError");
  });
});

describe("delete", () => {
  test("should delete a driver with a given id", async () => {
    prisma.driver.delete.mockResolvedValue({
      ...validDriverOutput,
      dateOfBirth: new Date(validDriverOutput.dateOfBirth),
    });

    const result = await repo.delete("test-id");

    assert(result.isOk);
    expect(result.value).toStrictEqual(true);
  });

  test("should return error if prisma throws", async () => {
    prisma.driver.delete.mockRejectedValue(new Error("test error"));

    const result = await repo.delete("test-id");

    assert(result.isError);
    expect(result.error).toBeInstanceOf(AppError);
    expect(result.error.message).toBe("test error");
    expect(result.error.code).toBe("databaseError");
  });
});

describe("count", () => {
  test("should the number of drivers saved in the database", async () => {
    prisma.driver.count.mockResolvedValue(1);

    const result = await repo.count();

    assert(result.isOk);
    expect(result.value).toStrictEqual(1);
  });

  test("should return error if prisma throws", async () => {
    prisma.driver.count.mockRejectedValue(new Error("test error"));

    const result = await repo.count();

    assert(result.isError);
    expect(result.error).toBeInstanceOf(AppError);
    expect(result.error.message).toBe("test error");
    expect(result.error.code).toBe("databaseError");
  });
});
