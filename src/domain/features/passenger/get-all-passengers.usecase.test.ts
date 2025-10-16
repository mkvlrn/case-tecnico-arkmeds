import assert from "node:assert/strict";
import { beforeEach, expect, test } from "@jest/globals";
import { type MockProxy, mock } from "jest-mock-extended";
import { validPassengerOutput } from "@/domain/__fixtures";
import { GetAllPassengersUseCase } from "@/domain/features/passenger/get-all-passengers.usecase";
import type { PassengerRepository } from "@/domain/features/passenger/passenger.repository";
import { AppError } from "@/domain/utils/app-error";
import { PaginationResult } from "@/domain/utils/pagination-result";
import { R } from "@/domain/utils/result";

let repo: MockProxy<PassengerRepository>;
let usecase: GetAllPassengersUseCase;

beforeEach(() => {
  repo = mock<PassengerRepository>();
  usecase = new GetAllPassengersUseCase(repo);
});

test("should return a valid paginated result when not passing page arg", async () => {
  repo.count.mockResolvedValue(R.ok(1));
  repo.getAll.mockResolvedValue(R.ok([validPassengerOutput]));

  const result = await usecase.execute();

  assert(result.isOk);
  expect(result.value).toStrictEqual(new PaginationResult(1, 1, [validPassengerOutput]));
});

test("should return a valid paginated result when passing page arg", async () => {
  repo.count.mockResolvedValue(R.ok(1));
  repo.getAll.mockResolvedValue(R.ok([validPassengerOutput]));

  const result = await usecase.execute(1);

  assert(result.isOk);
  expect(result.value).toStrictEqual(new PaginationResult(1, 1, [validPassengerOutput]));
});

test("should return an error if repository fails to count passengers", async () => {
  const expectedError = new AppError("databaseError", "database exploded");
  repo.count.mockResolvedValue(R.error(expectedError));

  const result = await usecase.execute();

  assert(result.isError);
  expect(result.error).toStrictEqual(expectedError);
});

test("should return an error if repository fails to fetch passengers", async () => {
  const expectedError = new AppError("databaseError", "database exploded");
  repo.count.mockResolvedValue(R.ok(1));
  repo.getAll.mockResolvedValue(R.error(expectedError));

  const result = await usecase.execute();

  assert(result.isError);
  expect(result.error).toStrictEqual(expectedError);
});
