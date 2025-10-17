import { afterEach, expect, jest, test } from "@jest/globals";
import { StatusCodes } from "http-status-codes";
import { mockDeep } from "jest-mock-extended";
import { CreatePassengerController } from "@/adapters/api/controllers/passengers/create-passenger.controller";
import { createControllerMocks } from "@/adapters/api/test-utils/controller-mocks";
import type { CreatePassengerUseCase } from "@/domain/features/passenger/create-passenger.usecase";
import { validPassengerOutput } from "@/domain/fixtures";
import { AppError } from "@/domain/utils/app-error";
import { R } from "@/domain/utils/result";

const usecase = mockDeep<CreatePassengerUseCase>();
const { controller, req, res, next } = createControllerMocks(CreatePassengerController, usecase);

afterEach(() => {
  jest.resetAllMocks();
});

test("should create and return a passenger", async () => {
  usecase.execute.mockResolvedValue(R.ok(validPassengerOutput));

  await controller.handle(req, res, next);

  expect(usecase.execute).toHaveBeenCalledWith(req.body);
  expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
  expect(res.json).toHaveBeenCalledWith(validPassengerOutput);
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
