import { afterEach, expect, jest, test } from "@jest/globals";
import { StatusCodes } from "http-status-codes";
import { mockDeep } from "jest-mock-extended";
import { UpdatePassengerController } from "@/adapters/api/controllers/passengers/update-passenger.controller";
import { createControllerMocks } from "@/adapters/api/test-utils/controller-mocks";
import { validPassengerOutput } from "@/domain/__fixtures";
import type { UpdatePassengerUseCase } from "@/domain/features/passenger/update-passenger.usecase";
import { AppError } from "@/domain/utils/app-error";
import { R } from "@/domain/utils/result";

const usecase = mockDeep<UpdatePassengerUseCase>();
const { controller, req, res, next } = createControllerMocks(UpdatePassengerController, usecase);

afterEach(() => {
  jest.resetAllMocks();
});

test("should update and return a passenger", async () => {
  usecase.execute.mockResolvedValue(R.ok(validPassengerOutput));
  const typedReq = req as typeof req & { params: { id: string } };
  typedReq.params = { id: "test-id" };
  typedReq.body = { name: "Updated Name" };

  await controller.handle(typedReq, res, next);

  expect(usecase.execute).toHaveBeenCalledWith("test-id", req.body);
  expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
  expect(res.json).toHaveBeenCalledWith(validPassengerOutput);
  expect(next).not.toHaveBeenCalled();
});

test("should pass error to error handler if usecase throws", async () => {
  const expectedError = new AppError("resourceNotFound", "passenger with id test-id not found");
  usecase.execute.mockResolvedValue(R.error(expectedError));
  const typedReq = req as typeof req & { params: { id: string } };
  typedReq.params = { id: "test-id" };
  typedReq.body = { name: "Updated Name" };

  await controller.handle(typedReq, res, next);

  expect(next).toHaveBeenCalledWith(expectedError);
  expect(res.status).not.toHaveBeenCalled();
  expect(res.json).not.toHaveBeenCalled();
});
