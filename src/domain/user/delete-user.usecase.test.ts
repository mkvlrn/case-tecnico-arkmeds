import assert from "node:assert/strict";
import { beforeEach, expect, test } from "@jest/globals";
import { type MockProxy, mock } from "jest-mock-extended";
import { DeleteUserUseCase } from "@/domain/user/delete-user.usecase";
import { type TestUser, validUserOutput } from "@/domain/user/fixtures";
import type { UserRepository } from "@/domain/user/user.repository";
import { AppError } from "@/domain/utils/app-error";
import { R } from "@/domain/utils/result";

let repo: MockProxy<UserRepository<TestUser>>;
let usecase: DeleteUserUseCase<TestUser>;

beforeEach(() => {
  repo = mock<UserRepository<TestUser>>();
  usecase = new DeleteUserUseCase(repo);
});

test("should delete a user successfully", async () => {
  repo.getById.mockResolvedValue(R.ok(validUserOutput));
  repo.delete.mockResolvedValue(R.ok(true));

  const result = await usecase.execute("test-id");

  assert(result.isOk);
  expect(result.value).toBeTruthy();
});

test("should return an error if user is not found", async () => {
  const expectedError = new AppError("resourceNotFound", "user not found");
  repo.getById.mockResolvedValue(R.error(expectedError));

  const result = await usecase.execute("non-existent-id");

  assert(result.isError);
  expect(result.error).toStrictEqual(expectedError);
});

test("should return an error if repository fails to delete user", async () => {
  const expectedError = new AppError("databaseError", "database exploded");
  repo.getById.mockResolvedValue(R.ok(validUserOutput));
  repo.delete.mockResolvedValue(R.error(expectedError));

  const result = await usecase.execute("test-id");

  assert(result.isError);
  expect(result.error).toStrictEqual(expectedError);
});
