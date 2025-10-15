import assert from "node:assert/strict";
import { beforeEach, expect, test } from "@jest/globals";
import { type MockProxy, mock } from "jest-mock-extended";
import {
  type TestSchema,
  type TestUser,
  validUserInput,
  validUserOutput,
} from "@/domain/user/fixtures";
import { UpdateUserUseCase } from "@/domain/user/update-user.usecase";
import type { UserRepository } from "@/domain/user/user.repository";
import { AppError } from "@/domain/utils/app-error";
import { R } from "@/domain/utils/result";

let repo: MockProxy<UserRepository<TestUser, TestSchema>>;
let usecase: UpdateUserUseCase<TestUser, TestSchema>;

beforeEach(() => {
  repo = mock<UserRepository<TestUser, TestSchema>>();
  usecase = new UpdateUserUseCase(repo);
});

test("should return a valid updated user", async () => {
  repo.getById.mockResolvedValue(R.ok(validUserOutput));
  repo.update.mockResolvedValue(R.ok(validUserOutput));

  const result = await usecase.execute("test-id", validUserInput);

  assert(result.isOk);
  expect(result.value).toStrictEqual(validUserOutput);
});

test("should return an error if repository fails to check for existing user", async () => {
  const expectedError = new AppError("databaseError", "database exploded");
  repo.getById.mockResolvedValue(R.error(expectedError));

  const result = await usecase.execute("test-id", validUserInput);

  assert(result.isError);
  expect(result.error).toStrictEqual(expectedError);
});

test("should return an error if repository fails to create user", async () => {
  const expectedError = new AppError("databaseError", "database exploded");
  repo.getById.mockResolvedValue(R.ok(validUserOutput));
  repo.update.mockResolvedValue(R.error(expectedError));

  const result = await usecase.execute("test-id", validUserInput);

  assert(result.isError);
  expect(result.error).toStrictEqual(expectedError);
});
