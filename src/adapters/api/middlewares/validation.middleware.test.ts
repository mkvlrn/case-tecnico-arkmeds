import { expect, jest, test } from "@jest/globals";
import type { Request, Response } from "express";
import { z } from "zod";
import { validation } from "@/adapters/api/middlewares/validation.middleware";
import { AppError } from "@/domain/utils/app-error";

const schema = z.object({
  name: z.string(),
});

test("should call next if validation succeeds", () => {
  const req = { body: { name: "Test" }, query: {} } as Request;
  const next = jest.fn();

  validation(schema)(req, {} as Response, next);

  expect(next).toHaveBeenCalled();
});

test("should throw AppError if validation fails", () => {
  const req = { body: {}, query: {}, params: {} } as Request;
  const next = jest.fn();

  const act = () => validation(schema)(req, {} as Response, next);

  expect(act).toThrow(AppError);
  expect(next).not.toHaveBeenCalled();
});
