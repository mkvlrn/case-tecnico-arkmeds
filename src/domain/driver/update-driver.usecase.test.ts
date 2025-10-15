import assert from "node:assert/strict";
import { beforeEach, expect, test } from "@jest/globals";
import { type MockProxy, mock } from "jest-mock-extended";
import type { CreateDriverSchema } from "@/adapters/api/driver/create-driver.schema";
import type { Driver } from "@/domain/driver/driver.entity";
import { validDriverInput, validDriverOutput } from "@/domain/driver/fixtures";
import { UpdateDriverUseCase } from "@/domain/driver/update-driver.usecase";
import type { UserRepository } from "@/domain/misc/user.repository";
import { AppError } from "@/domain/utils/app-error";
import { R } from "@/domain/utils/result";

let repo: MockProxy<UserRepository<Driver, CreateDriverSchema>>;
let usecase: UpdateDriverUseCase;

beforeEach(() => {
  repo = mock<UserRepository<Driver, CreateDriverSchema>>();
  usecase = new UpdateDriverUseCase(repo);
});

test("should return a valid updated driver", async () => {
  repo.getById.mockResolvedValue(R.ok(validDriverOutput));
  repo.update.mockResolvedValue(R.ok(validDriverOutput));

  const result = await usecase.execute("test-id", validDriverInput);

  assert(result.isOk);
  expect(result.value).toStrictEqual(validDriverOutput);
});

test("should return an error if repository fails to check for existing driver", async () => {
  const expectedError = new AppError("databaseError", "database exploded");
  repo.getById.mockResolvedValue(R.error(expectedError));

  const result = await usecase.execute("test-id", validDriverInput);

  assert(result.isError);
  expect(result.error).toStrictEqual(expectedError);
});

test("should return an error if repository fails to create driver", async () => {
  const expectedError = new AppError("databaseError", "database exploded");
  repo.getById.mockResolvedValue(R.ok(validDriverOutput));
  repo.update.mockResolvedValue(R.error(expectedError));

  const result = await usecase.execute("test-id", validDriverInput);

  assert(result.isError);
  expect(result.error).toStrictEqual(expectedError);
});
