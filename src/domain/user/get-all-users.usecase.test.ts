import assert from "node:assert/strict";
import { beforeEach, expect, test } from "@jest/globals";
import { type MockProxy, mock } from "jest-mock-extended";
import { type TestUser, validUserOutput, validUserPaginationResult } from "@/domain/user/fixtures";
import { GetAllUsersUseCase } from "@/domain/user/get-all-users.usecase";
import type { UserRepository } from "@/domain/user/user.repository";
import { AppError } from "@/domain/utils/app-error";
import { R } from "@/domain/utils/result";

let repo: MockProxy<UserRepository<TestUser>>;
let usecase: GetAllUsersUseCase<TestUser>;

beforeEach(() => {
  repo = mock<UserRepository<TestUser>>();
  usecase = new GetAllUsersUseCase(repo);
});

test("should return a valid paginated result when not passing page arg", async () => {
  repo.count.mockResolvedValue(R.ok(1));
  repo.getAll.mockResolvedValue(R.ok([validUserOutput]));

  const result = await usecase.execute();

  assert(result.isOk);
  expect(result.value).toStrictEqual(validUserPaginationResult);
});

test("should return a valid paginated result when passing page arg", async () => {
  repo.count.mockResolvedValue(R.ok(1));
  repo.getAll.mockResolvedValue(R.ok([validUserOutput]));

  const result = await usecase.execute(1);

  assert(result.isOk);
  expect(result.value).toStrictEqual(validUserPaginationResult);
});

test("should return an error if repository fails to count users", async () => {
  const expectedError = new AppError("databaseError", "database exploded");
  repo.count.mockResolvedValue(R.error(expectedError));

  const result = await usecase.execute();

  assert(result.isError);
  expect(result.error).toStrictEqual(expectedError);
});

test("should return an error if repository fails to fetch users", async () => {
  const expectedError = new AppError("databaseError", "database exploded");
  repo.count.mockResolvedValue(R.ok(1));
  repo.getAll.mockResolvedValue(R.error(expectedError));

  const result = await usecase.execute();

  assert(result.isError);
  expect(result.error).toStrictEqual(expectedError);
});
