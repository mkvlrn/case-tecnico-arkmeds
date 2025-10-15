import assert from "node:assert/strict";
import { beforeEach, expect, test } from "@jest/globals";
import { type MockProxy, mock } from "jest-mock-extended";
import type { Driver } from "@/domain/driver/driver.entity";
import { validDriverOutput, validDriverPaginationResult } from "@/domain/driver/fixtures";
import { GetAllDriversUseCase } from "@/domain/driver/get-all-drivers.usecase";
import type { UserRepository } from "@/domain/misc/user.repository";
import { AppError } from "@/domain/utils/app-error";
import { R } from "@/domain/utils/result";

let repo: MockProxy<UserRepository<Driver>>;
let usecase: GetAllDriversUseCase;

beforeEach(() => {
  repo = mock<UserRepository<Driver>>();
  usecase = new GetAllDriversUseCase(repo);
});

test("should return a valid paginated result when not passing page arg", async () => {
  repo.count.mockResolvedValue(R.ok(1));
  repo.getAll.mockResolvedValue(R.ok([validDriverOutput]));

  const result = await usecase.execute();

  assert(result.isOk);
  expect(result.value).toStrictEqual(validDriverPaginationResult);
});

test("should return a valid paginated result when passing page arg", async () => {
  repo.count.mockResolvedValue(R.ok(1));
  repo.getAll.mockResolvedValue(R.ok([validDriverOutput]));

  const result = await usecase.execute(1);

  assert(result.isOk);
  expect(result.value).toStrictEqual(validDriverPaginationResult);
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
