import assert from "node:assert/strict";
import { beforeEach, describe, expect, test } from "@jest/globals";
import type { RedisClientType } from "@redis/client";
import { type DeepMockProxy, mockDeep } from "jest-mock-extended";
import type { Fare } from "@/domain/features/fare/fare.model";
import { AppError } from "@/domain/utils/app-error";
import { RedisFaresRepo } from "@/infra/redis/fare.redis-repo";

const validFareOutput: Fare = {
  requestId: "test-fare-id",
  originLatitude: -23.5505,
  originLongitude: -46.6333,
  destinationLatitude: -23.5629,
  destinationLongitude: -46.6544,
  datetime: new Date("2024-01-01T10:00:00-03:00"),
  distanceInKm: 10,
  price: 25.5,
};

let redis: DeepMockProxy<RedisClientType>;
let repo: RedisFaresRepo;

beforeEach(() => {
  redis = mockDeep<RedisClientType>();
  repo = new RedisFaresRepo(redis, 600);
});

describe("create", () => {
  test("should create and return a valid fare", async () => {
    redis.set.mockResolvedValue("OK" as never);

    const result = await repo.create(validFareOutput);

    assert(result.isOk);
    expect(result.value).toStrictEqual(validFareOutput);
    expect(redis.set).toHaveBeenCalledWith(
      validFareOutput.requestId,
      JSON.stringify(validFareOutput),
      { expiration: { type: "EX", value: 600 } },
    );
  });

  test("should return error if redis throws", async () => {
    redis.set.mockRejectedValue(new Error("test error"));

    const result = await repo.create(validFareOutput);

    assert(result.isError);
    expect(result.error).toBeInstanceOf(AppError);
    expect(result.error.message).toBe("test error");
    expect(result.error.code).toBe("databaseError");
  });
});

describe("get", () => {
  test("should return a fare by a given id", async () => {
    redis.get.mockResolvedValue(JSON.stringify(validFareOutput));

    const result = await repo.get("test-fare-id");

    assert(result.isOk);
    expect(result.value).toStrictEqual(validFareOutput);
    expect(redis.get).toHaveBeenCalledWith("test-fare-id");
  });

  test("should return null if fare not found", async () => {
    redis.get.mockResolvedValue(null);

    const result = await repo.get("test-fare-id");

    assert(result.isOk);
    expect(result.value).toStrictEqual(null);
    expect(redis.get).toHaveBeenCalledWith("test-fare-id");
  });

  test("should return error if redis throws", async () => {
    redis.get.mockRejectedValue(new Error("test error"));

    const result = await repo.get("test-fare-id");

    assert(result.isError);
    expect(result.error).toBeInstanceOf(AppError);
    expect(result.error.message).toBe("test error");
    expect(result.error.code).toBe("databaseError");
  });
});
