import { expect, jest, test } from "@jest/globals";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { errorHandler } from "@/adapters/api/middleware/error-handler.middleware";
import { AppError } from "@/domain/utils/app-error";

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
} as unknown as Response;

test("should handle AppError", () => {
  const err = new AppError("databaseError", "Custom error", StatusCodes.INTERNAL_SERVER_ERROR);

  errorHandler(err, {} as Request, res, jest.fn());

  expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
  expect(res.json).toHaveBeenCalledWith(err.serialize());
});

test("should handle generic error", () => {
  const err = new Error("boom");

  errorHandler(err, {} as Request, res, jest.fn());

  expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
  expect(res.json).toHaveBeenCalledWith({
    code: "internalServerError",
    message: "boom",
    details: undefined,
  });
});
