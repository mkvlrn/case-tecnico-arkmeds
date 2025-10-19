import assert from "node:assert/strict";
import { beforeEach, expect, test } from "@jest/globals";
import { type MockProxy, mock } from "jest-mock-extended";
import { UpdatePassengerUseCase } from "@/domain/features/passenger/update-passenger.usecase";
import { validPassengerInput, validPassengerOutput } from "@/domain/fixtures";
import type { PassengerRepository } from "@/domain/shared/base-user.repository.ts";
import { AppError } from "@/domain/utils/app-error";
import { R } from "@/domain/utils/result";

let repo: MockProxy<PassengerRepository>;
let usecase: UpdatePassengerUseCase;

beforeEach(() => {
  repo = mock<PassengerRepository>();
  usecase = new UpdatePassengerUseCase(repo);
});

test("should return a valid updated passenger", async () => {
  repo.getById.mockResolvedValue(R.ok(validPassengerOutput));
  repo.getByCpf.mockResolvedValue(R.ok(null));
  repo.update.mockResolvedValue(R.ok(validPassengerOutput));

  const result = await usecase.execute("test-id", validPassengerInput);

  assert(result.isOk);
  expect(result.value).toStrictEqual(validPassengerOutput);
});

test("should return an error if repository fails to check for existing passenger", async () => {
  const expectedError = new AppError("databaseError", "database exploded");
  repo.getById.mockResolvedValue(R.error(expectedError));

  const result = await usecase.execute("test-id", validPassengerInput);

  assert(result.isError);
  expect(result.error).toStrictEqual(expectedError);
});

test("should return an error if updated cpf already exists", async () => {
  const expectedError = new AppError(
    "resourceConflict",
    `passenger with cpf ${validPassengerInput.cpf} already exists`,
  );
  repo.getById.mockResolvedValue(R.ok(validPassengerOutput));
  repo.getByCpf.mockResolvedValue(R.ok({ ...validPassengerOutput, id: "different-id" }));

  const result = await usecase.execute("test-id", validPassengerInput);

  assert(result.isError);
  expect(result.error).toStrictEqual(expectedError);
});

test("should return an error if cpf conflict check throws", async () => {
  const expectedError = new AppError("databaseError", "database exploded");
  repo.getById.mockResolvedValue(R.ok(validPassengerOutput));
  repo.getByCpf.mockResolvedValue(R.error(expectedError));

  const result = await usecase.execute("test-id", validPassengerInput);

  assert(result.isError);
  expect(result.error).toStrictEqual(expectedError);
});

test("should return an error if repository fails to create passenger", async () => {
  const expectedError = new AppError("databaseError", "database exploded");
  repo.getById.mockResolvedValue(R.ok(validPassengerOutput));
  repo.getByCpf.mockResolvedValue(R.ok(null));
  repo.update.mockResolvedValue(R.error(expectedError));

  const result = await usecase.execute("test-id", validPassengerInput);

  assert(result.isError);
  expect(result.error).toStrictEqual(expectedError);
});
