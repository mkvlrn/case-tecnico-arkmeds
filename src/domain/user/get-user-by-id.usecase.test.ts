import assert from "node:assert/strict";
import { beforeEach, expect, test } from "@jest/globals";
import { type MockProxy, mock } from "jest-mock-extended";
import { type TestUser, validUserOutput } from "@/domain/user/fixtures";
import { GetUserByIdUseCase } from "@/domain/user/get-user-by-id.usecase";
import type { UserRepository } from "@/domain/user/user.repository";
import { AppError } from "@/domain/utils/app-error";
import { R } from "@/domain/utils/result";

let repo: MockProxy<UserRepository<TestUser>>;
let usecase: GetUserByIdUseCase<TestUser>;

beforeEach(() => {
  repo = mock<UserRepository<TestUser>>();
  usecase = new GetUserByIdUseCase(repo);
});

test("should return a valid user", async () => {
  repo.getById.mockResolvedValue(R.ok(validUserOutput));

  const result = await usecase.execute("test-id");

  assert(result.isOk);
  expect(result.value).toStrictEqual(validUserOutput);
});

test("should return an error if repository fails to get user", async () => {
  const expectedError = new AppError("databaseError", "database exploded");
  repo.getById.mockResolvedValue(R.error(expectedError));

  const result = await usecase.execute("test-id");

  assert(result.isError);
  expect(result.error).toStrictEqual(expectedError);
});

test("should return an error if user is not found", async () => {
  const expectedError = new AppError("resourceNotFound", "user not found");
  repo.getById.mockResolvedValue(R.error(expectedError));

  const result = await usecase.execute("non-existent-id");

  assert(result.isError);
  expect(result.error).toStrictEqual(expectedError);
});
