import assert from "node:assert/strict";
import { beforeEach, expect, test } from "@jest/globals";
import { type MockProxy, mock } from "jest-mock-extended";
import type { CreateTripSchema } from "@/adapters/api/validation-schemas/trip.schema";
import type { Fare } from "@/domain/features/fare/fare.model";
import type { FareRepository } from "@/domain/features/fare/fare.repository";
import { CreateTripUseCase } from "@/domain/features/trip/create-trip.usecase";
import type { Trip } from "@/domain/features/trip/trip.model";
import type { TripNotifier } from "@/domain/features/trip/trip.notifier";
import { validPassengerOutput } from "@/domain/fixtures";
import type { PassengerRepository } from "@/domain/shared/base-user.repository";
import { AppError } from "@/domain/utils/app-error";
import { R } from "@/domain/utils/result";

let passengerRepo: MockProxy<PassengerRepository>;
let fareRepo: MockProxy<FareRepository>;
let tripNotifier: MockProxy<TripNotifier>;
let usecase: CreateTripUseCase;

const validTripInput: CreateTripSchema = {
  passengerId: "test-passenger-id",
  requestId: "test-request-id",
};

const validFare: Fare = {
  requestId: "test-request-id",
  originLatitude: -23.5505,
  originLongitude: -46.6333,
  destinationLatitude: -23.5629,
  destinationLongitude: -46.6544,
  datetime: new Date("2024-01-01T10:00:00Z"),
  distanceInKm: 10.5,
  price: 25.75,
};

const expectedTrip: Trip = {
  passengerId: "test-passenger-id",
  datetime: new Date("2024-01-01T10:00:00Z"),
  distanceInKm: 10.5,
  price: 25.75,
};

beforeEach(() => {
  passengerRepo = mock<PassengerRepository>();
  fareRepo = mock<FareRepository>();
  tripNotifier = mock<TripNotifier>();
  usecase = new CreateTripUseCase(passengerRepo, fareRepo, tripNotifier);
});

test("should create a trip, notify, and delete fare when passenger and fare exist", async () => {
  passengerRepo.getById.mockResolvedValue(R.ok(validPassengerOutput));
  fareRepo.get.mockResolvedValue(R.ok(validFare));
  fareRepo.delete.mockResolvedValue(R.ok(true));

  const result = await usecase.execute(validTripInput);

  assert(result.isOk);
  expect(result.value).toStrictEqual(expectedTrip);
  expect(tripNotifier.notify).toHaveBeenCalledWith(expectedTrip);
  expect(tripNotifier.notify).toHaveBeenCalledTimes(1);
  expect(fareRepo.delete).toHaveBeenCalledWith(validFare.requestId);
  expect(fareRepo.delete).toHaveBeenCalledTimes(1);
});

test("should return an error when passenger repository fails", async () => {
  const expectedError = new AppError("databaseError", "database exploded");
  passengerRepo.getById.mockResolvedValue(R.error(expectedError));

  const result = await usecase.execute(validTripInput);

  assert(result.isError);
  expect(result.error).toStrictEqual(expectedError);
  expect(tripNotifier.notify).not.toHaveBeenCalled();
  expect(fareRepo.delete).not.toHaveBeenCalled();
});

test("should return an error when passenger does not exist", async () => {
  const expectedError = new AppError(
    "resourceNotFound",
    `passenger with id ${validTripInput.passengerId} not found`,
  );
  passengerRepo.getById.mockResolvedValue(R.ok(null));

  const result = await usecase.execute(validTripInput);

  assert(result.isError);
  expect(result.error).toStrictEqual(expectedError);
  expect(tripNotifier.notify).not.toHaveBeenCalled();
  expect(fareRepo.delete).not.toHaveBeenCalled();
});

test("should return an error when fare repository fails", async () => {
  const expectedError = new AppError("databaseError", "database exploded");
  passengerRepo.getById.mockResolvedValue(R.ok(validPassengerOutput));
  fareRepo.get.mockResolvedValue(R.error(expectedError));

  const result = await usecase.execute(validTripInput);

  assert(result.isError);
  expect(result.error).toStrictEqual(expectedError);
  expect(tripNotifier.notify).not.toHaveBeenCalled();
  expect(fareRepo.delete).not.toHaveBeenCalled();
});

test("should return an error when fare does not exist", async () => {
  const expectedError = new AppError(
    "resourceNotFound",
    `fare with id ${validTripInput.requestId} not found`,
  );
  passengerRepo.getById.mockResolvedValue(R.ok(validPassengerOutput));
  fareRepo.get.mockResolvedValue(R.ok(null));

  const result = await usecase.execute(validTripInput);

  assert(result.isError);
  expect(result.error).toStrictEqual(expectedError);
  expect(tripNotifier.notify).not.toHaveBeenCalled();
  expect(fareRepo.delete).not.toHaveBeenCalled();
});
