import { afterEach, expect, jest, test } from "@jest/globals";
import { StatusCodes } from "http-status-codes";
import { mockDeep } from "jest-mock-extended";
import { CreateTripController } from "@/adapters/api/controllers/trips/create-trip.controller";
import { createControllerMocks } from "@/adapters/api/test-utils/controller-mocks";
import type { CreateTripUseCase } from "@/domain/features/trip/create-trip.usecase";
import type { Trip } from "@/domain/features/trip/trip.model";
import { AppError } from "@/domain/utils/app-error";
import { R } from "@/domain/utils/result";

const usecase = mockDeep<CreateTripUseCase>();
const { controller, req, res, next } = createControllerMocks(CreateTripController, usecase);

const validTripOutput: Trip = {
  passengerId: "test-passenger-id",
  driverId: "test-id",
  datetime: new Date("2024-01-01T10:00:00Z"),
  distanceInKm: 10.5,
  price: 25.75,
};

afterEach(() => {
  jest.resetAllMocks();
});

test("should create and return a trip", async () => {
  usecase.execute.mockResolvedValue(R.ok(validTripOutput));

  await controller.handle(req, res, next);

  expect(usecase.execute).toHaveBeenCalledWith(req.body);
  expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
  expect(res.json).toHaveBeenCalledWith(validTripOutput);
  expect(next).not.toHaveBeenCalled();
});

test("should pass error to error handler if usecase throws", async () => {
  const expectedError = new AppError("databaseError", "database exploded");
  usecase.execute.mockResolvedValue(R.error(expectedError));

  await controller.handle(req, res, next);

  expect(next).toHaveBeenCalledWith(expectedError);
  expect(res.status).not.toHaveBeenCalled();
  expect(res.json).not.toHaveBeenCalled();
});
