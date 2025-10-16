import { afterEach, expect, jest, test } from "@jest/globals";
import { StatusCodes } from "http-status-codes";
import { mockDeep } from "jest-mock-extended";
import { DeletePassengerController } from "@/adapters/api/controllers/delete-passenger.controller";
import { createControllerMocks } from "@/adapters/api/test-utils/controller-mocks";
import type { DeletePassengerUseCase } from "@/domain/features/passenger/delete-passenger.usecase";
import { AppError } from "@/domain/utils/app-error";
import { R } from "@/domain/utils/result";

const usecase = mockDeep<DeletePassengerUseCase>();
const { controller, req, res, next } = createControllerMocks(DeletePassengerController, usecase);

afterEach(() => {
  jest.resetAllMocks();
});

test("should delete a passenger", async () => {
  const typedReq = req as typeof req & { params: { id: string } };
  typedReq.params = { id: "test-id" };
  usecase.execute.mockResolvedValue(R.ok(true));

  await controller.handle(typedReq, res, next);

  expect(usecase.execute).toHaveBeenCalledWith("test-id");
  expect(res.status).toHaveBeenCalledWith(StatusCodes.NO_CONTENT);
  expect(res.send).toHaveBeenCalled();
  expect(next).not.toHaveBeenCalled();
});

test("should pass error to error handler if usecase throws", async () => {
  const expectedError = new AppError("resourceNotFound", "passenger with id test-id not found");
  const typedReq = req as typeof req & { params: { id: string } };
  typedReq.params = { id: "test-id" };
  usecase.execute.mockResolvedValue(R.error(expectedError));

  await controller.handle(typedReq, res, next);

  expect(next).toHaveBeenCalledWith(expectedError);
  expect(res.status).not.toHaveBeenCalled();
  expect(res.send).not.toHaveBeenCalled();
});
