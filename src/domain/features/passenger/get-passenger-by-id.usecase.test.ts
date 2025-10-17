import assert from "node:assert/strict";
import { beforeEach, expect, test } from "@jest/globals";
import { type MockProxy, mock } from "jest-mock-extended";
import { GetPassengerByIdUseCase } from "@/domain/features/passenger/get-passenger-by-id.usecase";
import { validPassengerOutput } from "@/domain/fixtures";
import type { PassengerRepository } from "@/domain/shared/base-user.repository.ts";
import { AppError } from "@/domain/utils/app-error";
import { R } from "@/domain/utils/result";

let repo: MockProxy<PassengerRepository>;
let usecase: GetPassengerByIdUseCase;

beforeEach(() => {
  repo = mock<PassengerRepository>();
  usecase = new GetPassengerByIdUseCase(repo);
});

test("should return a valid passenger", async () => {
  repo.getById.mockResolvedValue(R.ok(validPassengerOutput));

  const result = await usecase.execute("test-id");

  assert(result.isOk);
  expect(result.value).toStrictEqual(validPassengerOutput);
});

test("should return an error if passenger is not found", async () => {
  const expectedError = new AppError(
    "resourceNotFound",
    "passenger with id non-existent-id not found",
  );
  repo.getById.mockResolvedValue(R.ok(null));

  const result = await usecase.execute("non-existent-id");

  assert(result.isError);
  expect(result.error).toStrictEqual(expectedError);
});

test("should return an error if repository fails to get passenger", async () => {
  const expectedError = new AppError("databaseError", "database exploded");
  repo.getById.mockResolvedValue(R.error(expectedError));

  const result = await usecase.execute("test-id");

  assert(result.isError);
  expect(result.error).toStrictEqual(expectedError);
});
