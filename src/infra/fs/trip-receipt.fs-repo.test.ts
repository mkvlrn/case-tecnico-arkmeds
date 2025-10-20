import assert from "node:assert/strict";
import { beforeEach, expect, jest, test } from "@jest/globals";
import type { Trip } from "@/domain/features/trip/trip.model";
import { AppError } from "@/domain/utils/app-error";

const mockWriteFile = jest.fn();
const mockMkdir = jest.fn();
jest.unstable_mockModule("node:fs/promises", async () => ({
  writeFile: mockWriteFile,
  mkdir: mockMkdir,
}));

const validTrip: Trip = {
  passengerId: "test-passenger-id",
  driverId: "test-id",
  datetime: new Date("2024-01-15T14:30:45Z"),
  distanceInKm: 10.5,
  price: 25.75,
};

const { FilesystemTripReceiptRepo } = await import("@/infra/fs/trip-receipt.fs-repo");
let repo: InstanceType<typeof FilesystemTripReceiptRepo>;

beforeEach(() => {
  jest.resetAllMocks();
  repo = new FilesystemTripReceiptRepo("/tmp");
});

test("should save trip to file and return true", async () => {
  mockWriteFile.mockResolvedValue({} as never);

  const result = await repo.save(validTrip);

  assert(result.isOk);
  expect(result.value).toBe(true);
  expect(mockWriteFile).toHaveBeenCalledTimes(1);
});

test("should create correct directory structure with date folders", async () => {
  mockWriteFile.mockResolvedValue({} as never);

  await repo.save(validTrip);

  expect(mockWriteFile).toHaveBeenCalledWith(
    "/tmp/test-passenger-id/2024-01-15/14_30_45.txt",
    JSON.stringify(validTrip, null, 2),
    "utf-8",
  );
});

test("should create filename with time from trip datetime", async () => {
  mockWriteFile.mockResolvedValue({} as never);
  const tripWithDifferentTime = {
    ...validTrip,
    datetime: new Date("2024-03-20T09:15:30Z"),
  };

  await repo.save(tripWithDifferentTime);

  expect(mockWriteFile).toHaveBeenCalledWith(
    "/tmp/test-passenger-id/2024-03-20/09_15_30.txt",
    expect.any(String),
    "utf-8",
  );
});

test("should organize files by passenger id", async () => {
  mockWriteFile.mockResolvedValue({} as never);
  const tripWithDifferentPassenger = {
    ...validTrip,
    passengerId: "another-passenger",
  };

  await repo.save(tripWithDifferentPassenger);

  expect(mockWriteFile).toHaveBeenCalledWith(
    "/tmp/another-passenger/2024-01-15/14_30_45.txt",
    expect.any(String),
    "utf-8",
  );
});

test("should format JSON with proper indentation", async () => {
  mockWriteFile.mockResolvedValue({} as never);

  await repo.save(validTrip);

  const expectedJson = JSON.stringify(validTrip, null, 2);
  expect(mockWriteFile).toHaveBeenCalledWith(expect.any(String), expectedJson, "utf-8");
});

test("should return error if file write fails", async () => {
  mockWriteFile.mockRejectedValue(new Error("permission denied") as never);

  const result = await repo.save(validTrip);

  assert(result.isError);
  expect(result.error).toBeInstanceOf(AppError);
  expect(result.error.message).toBe("permission denied");
  expect(result.error.code).toBe("fsError");
});

test("should use configured output directory", async () => {
  mockWriteFile.mockResolvedValue({} as never);
  const customRepo = new FilesystemTripReceiptRepo("/custom/path");

  await customRepo.save(validTrip);

  expect(mockWriteFile).toHaveBeenCalledWith(
    "/custom/path/test-passenger-id/2024-01-15/14_30_45.txt",
    expect.any(String),
    "utf-8",
  );
});

test("should handle trips on different dates correctly", async () => {
  mockWriteFile.mockResolvedValue({} as never);
  const trip1 = { ...validTrip, datetime: new Date("2024-01-15T10:00:00Z") };
  const trip2 = { ...validTrip, datetime: new Date("2024-01-16T15:30:00Z") };

  await repo.save(trip1);
  await repo.save(trip2);

  expect(mockWriteFile).toHaveBeenNthCalledWith(
    1,
    "/tmp/test-passenger-id/2024-01-15/10_00_00.txt",
    expect.any(String),
    "utf-8",
  );
  expect(mockWriteFile).toHaveBeenNthCalledWith(
    2,
    "/tmp/test-passenger-id/2024-01-16/15_30_00.txt",
    expect.any(String),
    "utf-8",
  );
});

test("should handle multiple trips on same day with different times", async () => {
  mockWriteFile.mockResolvedValue({} as never);
  const trip1 = { ...validTrip, datetime: new Date("2024-01-15T10:00:00Z") };
  const trip2 = { ...validTrip, datetime: new Date("2024-01-15T16:45:30Z") };

  await repo.save(trip1);
  await repo.save(trip2);

  expect(mockWriteFile).toHaveBeenNthCalledWith(
    1,
    "/tmp/test-passenger-id/2024-01-15/10_00_00.txt",
    expect.any(String),
    "utf-8",
  );
  expect(mockWriteFile).toHaveBeenNthCalledWith(
    2,
    "/tmp/test-passenger-id/2024-01-15/16_45_30.txt",
    expect.any(String),
    "utf-8",
  );
});
