import { afterEach, expect, jest, test } from "@jest/globals";
import { StatusCodes } from "http-status-codes";
import { mockDeep } from "jest-mock-extended";
import { CreateFareController } from "@/adapters/api/controllers/fares/create-fare.controller";
import { createControllerMocks } from "@/adapters/api/test-utils/controller-mocks";
import type { CreateFareUseCase } from "@/domain/features/fare/create-fare.usecase";
import type { Fare } from "@/domain/features/fare/fare.model";
import { AppError } from "@/domain/utils/app-error";
import { R } from "@/domain/utils/result";

const usecase = mockDeep<CreateFareUseCase>();
const { controller, req, res, next } = createControllerMocks(CreateFareController, usecase);
const validFareOutput: Fare = {
  requestId: "test-fare-id",
  originLatitude: -23.5505,
  originLongitude: -46.6333,
  destinationLatitude: -23.5629,
  destinationLongitude: -46.6544,
  datetime: new Date("2024-01-01T10:00:00-03:00"),
  price: 25.5,
};

afterEach(() => {
  jest.resetAllMocks();
});

test("should create and return a fare", async () => {
  usecase.execute.mockResolvedValue(R.ok(validFareOutput));

  await controller.handle(req, res, next);

  expect(usecase.execute).toHaveBeenCalledWith(req.body);
  expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
  expect(res.json).toHaveBeenCalledWith(validFareOutput);
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
