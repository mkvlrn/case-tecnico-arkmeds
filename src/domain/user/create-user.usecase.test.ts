import assert from "node:assert/strict";
import { beforeEach, expect, test } from "@jest/globals";
import { type MockProxy, mock } from "jest-mock-extended";
import { CreateUserUseCase } from "@/domain/user/create-user.usecase";
import {
  type TestSchema,
  type TestUser,
  validUserInput,
  validUserOutput,
} from "@/domain/user/fixtures";
import type { UserRepository } from "@/domain/user/user.repository";
import { AppError } from "@/domain/utils/app-error";
import { R } from "@/domain/utils/result";

let repo: MockProxy<UserRepository<TestUser, TestSchema>>;
let usecase: CreateUserUseCase<TestUser, TestSchema>;

beforeEach(() => {
  repo = mock<UserRepository<TestUser, TestSchema>>();
  usecase = new CreateUserUseCase(repo);
});

test("should return a valid user", async () => {
  repo.create.mockResolvedValue(R.ok(validUserOutput));

  const result = await usecase.execute(validUserInput);

  assert(result.isOk);
  expect(result.value).toStrictEqual(validUserOutput);
});

test("should return an error if repository fails to create user", async () => {
  const expectedError = new AppError("databaseError", "database exploded");
  repo.create.mockResolvedValue(R.error(expectedError));

  const result = await usecase.execute(validUserInput);

  assert(result.isError);
  expect(result.error).toStrictEqual(expectedError);
});
