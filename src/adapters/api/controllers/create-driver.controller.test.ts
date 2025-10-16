import { afterEach, expect, jest, test } from "@jest/globals";
import { StatusCodes } from "http-status-codes";
import { mockDeep } from "jest-mock-extended";
import { CreateDriverController } from "@/adapters/api/controllers/create-driver.controller";
import { createControllerMocks } from "@/adapters/api/test-utils/controller-mocks";
import { validDriverOutput } from "@/domain/__fixtures";
import type { CreateDriverUseCase } from "@/domain/features/driver/create-driver.usecase";
import { AppError } from "@/domain/utils/app-error";
import { R } from "@/domain/utils/result";

const usecase = mockDeep<CreateDriverUseCase>();
const { controller, req, res, next } = createControllerMocks(CreateDriverController, usecase);

afterEach(() => {
  jest.resetAllMocks();
});

test("should create and return a driver", async () => {
  usecase.execute.mockResolvedValue(R.ok(validDriverOutput));

  await controller.handle(req, res, next);

  expect(usecase.execute).toHaveBeenCalledWith(req.body);
  expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
  expect(res.json).toHaveBeenCalledWith(validDriverOutput);
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
