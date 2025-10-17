import { afterEach, expect, jest, test } from "@jest/globals";
import { StatusCodes } from "http-status-codes";
import { mockDeep } from "jest-mock-extended";
import { GetAllDriversController } from "@/adapters/api/controllers/drivers/get-all-drivers.controller";
import { createControllerMocks } from "@/adapters/api/test-utils/controller-mocks";
import { validDriverOutput } from "@/domain/__fixtures";
import type { Driver } from "@/domain/features/driver/driver.model";
import type { GetAllDriversUseCase } from "@/domain/features/driver/get-all-drivers.usecase";
import { AppError } from "@/domain/utils/app-error";
import { PaginationResult } from "@/domain/utils/pagination-result";
import { R } from "@/domain/utils/result";

const usecase = mockDeep<GetAllDriversUseCase>();
const { controller, req, res, next } = createControllerMocks(GetAllDriversController, usecase);

afterEach(() => {
  jest.resetAllMocks();
});

test("should return all drivers", async () => {
  const drivers = new PaginationResult<Driver>(1, 1, [validDriverOutput]);
  usecase.execute.mockResolvedValue(R.ok(drivers));
  const typedReq = req as typeof req & { query: { page: string } };
  typedReq.query = { page: "1" };

  await controller.handle(typedReq, res, next);

  expect(usecase.execute).toHaveBeenCalledWith(1);
  expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
  expect(res.json).toHaveBeenCalledWith(drivers);
  expect(next).not.toHaveBeenCalled();
});

test("should pass error to error handler if usecase throws", async () => {
  const expectedError = new AppError("databaseError", "database exploded");
  usecase.execute.mockResolvedValue(R.error(expectedError));
  const typedReq = req as typeof req & { query: { page: string } };
  typedReq.query = { page: "1" };

  await controller.handle(typedReq, res, next);

  expect(next).toHaveBeenCalledWith(expectedError);
  expect(res.status).not.toHaveBeenCalled();
  expect(res.json).not.toHaveBeenCalled();
});
