import assert from "node:assert/strict";
import { beforeEach, expect, test } from "@jest/globals";
import { type MockProxy, mock } from "jest-mock-extended";
import { validDriverInput, validDriverOutput } from "@/domain/__fixtures";
import { UpdateDriverUseCase } from "@/domain/features/driver/update-driver.usecase";
import type { DriverRepository } from "@/domain/shared/base-user.repository.ts";
import { AppError } from "@/domain/utils/app-error";
import { R } from "@/domain/utils/result";

let repo: MockProxy<DriverRepository>;
let usecase: UpdateDriverUseCase;

beforeEach(() => {
  repo = mock<DriverRepository>();
  usecase = new UpdateDriverUseCase(repo);
});

test("should return a valid updated driver", async () => {
  repo.getById.mockResolvedValue(R.ok(validDriverOutput));
  repo.getByCpf.mockResolvedValue(R.ok(null));
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

test("should return an error if updated cpf already exists", async () => {
  const expectedError = new AppError(
    "resourceConflict",
    `driver with cpf ${validDriverInput.cpf} already exists`,
  );
  repo.getById.mockResolvedValue(R.ok(validDriverOutput));
  repo.getByCpf.mockResolvedValue(R.ok(validDriverOutput));

  const result = await usecase.execute("test-id", validDriverInput);

  assert(result.isError);
  expect(result.error).toStrictEqual(expectedError);
});

test("should return an error if cpf conflict check throws", async () => {
  const expectedError = new AppError("databaseError", "database exploded");
  repo.getById.mockResolvedValue(R.ok(validDriverOutput));
  repo.getByCpf.mockResolvedValue(R.error(expectedError));

  const result = await usecase.execute("test-id", validDriverInput);

  assert(result.isError);
  expect(result.error).toStrictEqual(expectedError);
});

test("should return an error if repository fails to create driver", async () => {
  const expectedError = new AppError("databaseError", "database exploded");
  repo.getById.mockResolvedValue(R.ok(validDriverOutput));
  repo.getByCpf.mockResolvedValue(R.ok(null));
  repo.update.mockResolvedValue(R.error(expectedError));

  const result = await usecase.execute("test-id", validDriverInput);

  assert(result.isError);
  expect(result.error).toStrictEqual(expectedError);
});
