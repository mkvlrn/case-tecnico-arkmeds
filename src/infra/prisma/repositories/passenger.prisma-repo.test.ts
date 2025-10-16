import assert from "node:assert/strict";
import { beforeEach, describe, expect, test } from "@jest/globals";
import { type DeepMockProxy, mockDeep } from "jest-mock-extended";
import { validPassengerInput, validPassengerOutput } from "@/domain/__fixtures";
import { AppError } from "@/domain/utils/app-error";
import type { PrismaClient } from "@/generated/prisma/client";
import { PassengerPrismaRepo } from "@/infra/prisma/repositories/passenger.prisma-repo";

let prisma: DeepMockProxy<PrismaClient>;
let repo: PassengerPrismaRepo;

beforeEach(() => {
  prisma = mockDeep<PrismaClient>();
  repo = new PassengerPrismaRepo(prisma);
});

describe("create", () => {
  test("should create and return a valid passenger", async () => {
    prisma.passenger.create.mockResolvedValue(validPassengerOutput);

    const result = await repo.create(validPassengerInput);

    assert(result.isOk);
    expect(result.value).toStrictEqual(validPassengerOutput);
  });

  test("should return error if prisma throws", async () => {
    prisma.passenger.create.mockRejectedValue(new Error("test error"));

    const result = await repo.create(validPassengerOutput);

    assert(result.isError);
    expect(result.error).toBeInstanceOf(AppError);
    expect(result.error.message).toBe("test error");
    expect(result.error.code).toBe("databaseError");
  });
});

describe("getAll", () => {
  test("should return passengers", async () => {
    prisma.passenger.findMany.mockResolvedValue([validPassengerOutput]);

    const result = await repo.getAll(1);

    assert(result.isOk);
    expect(result.value).toStrictEqual([validPassengerOutput]);
  });

  test("should return error if prisma throws", async () => {
    prisma.passenger.findMany.mockRejectedValue(new Error("test error"));

    const result = await repo.getAll(1);

    assert(result.isError);
    expect(result.error).toBeInstanceOf(AppError);
    expect(result.error.message).toBe("test error");
    expect(result.error.code).toBe("databaseError");
  });
});

describe("getById", () => {
  test("should return a passenger by a given id", async () => {
    prisma.passenger.findUnique.mockResolvedValue(validPassengerOutput);

    const result = await repo.getById("test-id");

    assert(result.isOk);
    expect(result.value).toStrictEqual(validPassengerOutput);
  });

  test("should return error if prisma throws", async () => {
    prisma.passenger.findUnique.mockRejectedValue(new Error("test error"));

    const result = await repo.getById("test-id");

    assert(result.isError);
    expect(result.error).toBeInstanceOf(AppError);
    expect(result.error.message).toBe("test error");
    expect(result.error.code).toBe("databaseError");
  });
});

describe("update", () => {
  test("should update and return a valid passenger", async () => {
    prisma.passenger.update.mockResolvedValue(validPassengerOutput);

    const result = await repo.update("test-id", validPassengerInput);

    assert(result.isOk);
    expect(result.value).toStrictEqual(validPassengerOutput);
  });

  test("should return error if prisma throws", async () => {
    prisma.passenger.update.mockRejectedValue(new Error("test error"));

    const result = await repo.update("test-id", validPassengerInput);

    assert(result.isError);
    expect(result.error).toBeInstanceOf(AppError);
    expect(result.error.message).toBe("test error");
    expect(result.error.code).toBe("databaseError");
  });
});

describe("delete", () => {
  test("should delete a passenger with a given id", async () => {
    prisma.passenger.delete.mockResolvedValue(validPassengerOutput);

    const result = await repo.delete("test-id");

    assert(result.isOk);
    expect(result.value).toStrictEqual(true);
  });

  test("should return error if prisma throws", async () => {
    prisma.passenger.delete.mockRejectedValue(new Error("test error"));

    const result = await repo.delete("test-id");

    assert(result.isError);
    expect(result.error).toBeInstanceOf(AppError);
    expect(result.error.message).toBe("test error");
    expect(result.error.code).toBe("databaseError");
  });
});

describe("count", () => {
  test("should the number of passengers saved in the database", async () => {
    prisma.passenger.count.mockResolvedValue(1);

    const result = await repo.count();

    assert(result.isOk);
    expect(result.value).toStrictEqual(1);
  });

  test("should return error if prisma throws", async () => {
    prisma.passenger.count.mockRejectedValue(new Error("test error"));

    const result = await repo.count();

    assert(result.isError);
    expect(result.error).toBeInstanceOf(AppError);
    expect(result.error.message).toBe("test error");
    expect(result.error.code).toBe("databaseError");
  });
});
