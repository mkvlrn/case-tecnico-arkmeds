import { afterEach, expect, jest, test } from "@jest/globals";
import { StatusCodes } from "http-status-codes";
import { mockDeep } from "jest-mock-extended";
import { GetAllPassengersController } from "@/adapters/api/controllers/passengers/get-all-passengers.controller";
import { createControllerMocks } from "@/adapters/api/test-utils/controller-mocks";
import { validPassengerOutput } from "@/domain/__fixtures";
import type { GetAllPassengersUseCase } from "@/domain/features/passenger/get-all-passengers.usecase";
import type { Passenger } from "@/domain/features/passenger/passenger.model";
import { AppError } from "@/domain/utils/app-error";
import { PaginationResult } from "@/domain/utils/pagination-result";
import { R } from "@/domain/utils/result";

const usecase = mockDeep<GetAllPassengersUseCase>();
const { controller, req, res, next } = createControllerMocks(GetAllPassengersController, usecase);

afterEach(() => {
  jest.resetAllMocks();
});

test("should return all passengers", async () => {
  const passengers = new PaginationResult<Passenger>(1, 1, [validPassengerOutput]);
  usecase.execute.mockResolvedValue(R.ok(passengers));
  const typedReq = req as typeof req & { query: { page: string } };
  typedReq.query = { page: "1" };

  await controller.handle(typedReq, res, next);

  expect(usecase.execute).toHaveBeenCalledWith(1);
  expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
  expect(res.json).toHaveBeenCalledWith(passengers);
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
