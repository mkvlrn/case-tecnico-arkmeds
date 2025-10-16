import assert from "node:assert/strict";
import { beforeEach, expect, test } from "@jest/globals";
import { type MockProxy, mock } from "jest-mock-extended";
import { validDriverOutput } from "@/domain/__fixtures";
import type { Driver } from "@/domain/features/driver/driver.model";
import { GetAllDriversUseCase } from "@/domain/features/driver/get-all-drivers.usecase";
import type { DriverRepository } from "@/domain/shared/base-user.repository.ts";
import { AppError } from "@/domain/utils/app-error";
import { PaginationResult } from "@/domain/utils/pagination-result";
import { R } from "@/domain/utils/result";

let repo: MockProxy<DriverRepository>;
let usecase: GetAllDriversUseCase;

beforeEach(() => {
  repo = mock<DriverRepository>();
  usecase = new GetAllDriversUseCase(repo);
});

test("should return a valid paginated result when not passing page arg", async () => {
  repo.count.mockResolvedValue(R.ok(1));
  repo.getAll.mockResolvedValue(R.ok([validDriverOutput]));

  const result = await usecase.execute();

  assert(result.isOk);
  expect(result.value).toStrictEqual(new PaginationResult<Driver>(1, 1, [validDriverOutput]));
});

test("should return a valid paginated result when passing page arg", async () => {
  repo.count.mockResolvedValue(R.ok(1));
  repo.getAll.mockResolvedValue(R.ok([validDriverOutput]));

  const result = await usecase.execute(1);

  assert(result.isOk);
  expect(result.value).toStrictEqual(new PaginationResult<Driver>(1, 1, [validDriverOutput]));
});

test("should return an error if repository fails to count drivers", async () => {
  const expectedError = new AppError("databaseError", "database exploded");
  repo.count.mockResolvedValue(R.error(expectedError));

  const result = await usecase.execute();

  assert(result.isError);
  expect(result.error).toStrictEqual(expectedError);
});

test("should return an error if repository fails to fetch drivers", async () => {
  const expectedError = new AppError("databaseError", "database exploded");
  repo.count.mockResolvedValue(R.ok(1));
  repo.getAll.mockResolvedValue(R.error(expectedError));

  const result = await usecase.execute();

  assert(result.isError);
  expect(result.error).toStrictEqual(expectedError);
});
