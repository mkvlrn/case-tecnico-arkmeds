import assert from "node:assert/strict";
import { beforeEach, expect, test } from "@jest/globals";
import { type MockProxy, mock } from "jest-mock-extended";
import { validDriverOutput } from "@/domain/__fixtures";
import { GetDriverByIdUseCase } from "@/domain/features/driver/get-driver-by-id.usecase";
import type { DriverRepository } from "@/domain/shared/base-user.repository.ts";
import { AppError } from "@/domain/utils/app-error";
import { R } from "@/domain/utils/result";

let repo: MockProxy<DriverRepository>;
let usecase: GetDriverByIdUseCase;

beforeEach(() => {
  repo = mock<DriverRepository>();
  usecase = new GetDriverByIdUseCase(repo);
});

test("should return a valid driver", async () => {
  repo.getById.mockResolvedValue(R.ok(validDriverOutput));

  const result = await usecase.execute("test-id");

  assert(result.isOk);
  expect(result.value).toStrictEqual(validDriverOutput);
});

test("should return an error if driver is not found", async () => {
  const expectedError = new AppError(
    "resourceNotFound",
    "driver with id non-existent-id not found",
  );
  repo.getById.mockResolvedValue(R.ok(null));

  const result = await usecase.execute("non-existent-id");

  assert(result.isError);
  expect(result.error).toStrictEqual(expectedError);
});

test("should return an error if repository fails to get driver", async () => {
  const expectedError = new AppError("databaseError", "database exploded");
  repo.getById.mockResolvedValue(R.error(expectedError));

  const result = await usecase.execute("test-id");

  assert(result.isError);
  expect(result.error).toStrictEqual(expectedError);
});
