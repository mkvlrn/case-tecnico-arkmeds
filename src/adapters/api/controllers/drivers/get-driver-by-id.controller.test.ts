import { afterEach, expect, jest, test } from "@jest/globals";
import { StatusCodes } from "http-status-codes";
import { mockDeep } from "jest-mock-extended";
import { GetDriverByIdController } from "@/adapters/api/controllers/drivers/get-driver-by-id.controller";
import { createControllerMocks } from "@/adapters/api/test-utils/controller-mocks";
import type { GetDriverByIdUseCase } from "@/domain/features/driver/get-driver-by-id.usecase";
import { validDriverOutput } from "@/domain/fixtures";
import { AppError } from "@/domain/utils/app-error";
import { R } from "@/domain/utils/result";

const usecase = mockDeep<GetDriverByIdUseCase>();
const { controller, req, res, next } = createControllerMocks(GetDriverByIdController, usecase);

afterEach(() => {
  jest.resetAllMocks();
});

test("should return a driver by id", async () => {
  usecase.execute.mockResolvedValue(R.ok(validDriverOutput));
  const typedReq = req as typeof req & { params: { id: string } };
  typedReq.params = { id: "test-id" };

  await controller.handle(typedReq, res, next);

  expect(usecase.execute).toHaveBeenCalledWith("test-id");
  expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
  expect(res.json).toHaveBeenCalledWith(validDriverOutput);
  expect(next).not.toHaveBeenCalled();
});

test("should pass error to error handler if usecase throws", async () => {
  const expectedError = new AppError("resourceNotFound", "driver with id test-id not found");
  usecase.execute.mockResolvedValue(R.error(expectedError));
  const typedReq = req as typeof req & { params: { id: string } };
  typedReq.params = { id: "test-id" };

  await controller.handle(typedReq, res, next);

  expect(next).toHaveBeenCalledWith(expectedError);
  expect(res.status).not.toHaveBeenCalled();
  expect(res.json).not.toHaveBeenCalled();
});
