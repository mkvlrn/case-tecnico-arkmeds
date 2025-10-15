import assert from "node:assert/strict";
import { beforeEach, expect, test } from "@jest/globals";
import { type MockProxy, mock } from "jest-mock-extended";
import { DeleteDriverUseCase } from "@/domain/driver/delete-driver.usecase";
import type { Driver } from "@/domain/driver/driver.entity";
import { validDriverOutput } from "@/domain/driver/fixtures";
import type { UserRepository } from "@/domain/misc/user.repository";
import { AppError } from "@/domain/utils/app-error";
import { R } from "@/domain/utils/result";

let repo: MockProxy<UserRepository<Driver>>;
let usecase: DeleteDriverUseCase;

beforeEach(() => {
  repo = mock<UserRepository<Driver>>();
  usecase = new DeleteDriverUseCase(repo);
});

test("should delete a driver successfully", async () => {
  repo.getById.mockResolvedValue(R.ok(validDriverOutput));
  repo.delete.mockResolvedValue(R.ok(true));

  const result = await usecase.execute("test-id");

  assert(result.isOk);
  expect(result.value).toBeTruthy();
});

test("should return an error if driver is not found", async () => {
  const expectedError = new AppError("resourceNotFound", "driver not found");
  repo.getById.mockResolvedValue(R.error(expectedError));

  const result = await usecase.execute("non-existent-id");

  assert(result.isError);
  expect(result.error).toStrictEqual(expectedError);
});

test("should return an error if repository fails to delete driver", async () => {
  const expectedError = new AppError("databaseError", "database exploded");
  repo.getById.mockResolvedValue(R.ok(validDriverOutput));
  repo.delete.mockResolvedValue(R.error(expectedError));

  const result = await usecase.execute("test-id");

  assert(result.isError);
  expect(result.error).toStrictEqual(expectedError);
});
