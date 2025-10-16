import { expect, jest, test } from "@jest/globals";
import type { Request, Response } from "express";
import { z } from "zod";
import { validation } from "@/adapters/api/middleware/validation.middleware";
import { AppError } from "@/domain/utils/app-error";

const schema = z.object({
  body: z.object({ name: z.string() }),
  query: z.object({}),
  params: z.object({}),
});

test("should call next if validation succeeds", () => {
  const req = { body: { name: "John" }, query: {}, params: {} } as Request;
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
