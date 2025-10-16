import assert from "node:assert/strict";
import { beforeEach, expect, test } from "@jest/globals";
import { type MockProxy, mock } from "jest-mock-extended";
import { validPassengerInput, validPassengerOutput } from "@/domain/__fixtures";
import { CreatePassengerUseCase } from "@/domain/features/passenger/create-passenger.usecase";
import type { PassengerRepository } from "@/domain/shared/base-user.repository.ts";
import { AppError } from "@/domain/utils/app-error";
import { R } from "@/domain/utils/result";

let repo: MockProxy<PassengerRepository>;
let usecase: CreatePassengerUseCase;

beforeEach(() => {
  repo = mock<PassengerRepository>();
  usecase = new CreatePassengerUseCase(repo);
});

test("should create and return a valid passenger", async () => {
  repo.getByCpf.mockResolvedValue(R.ok(null));
  repo.create.mockResolvedValue(R.ok(validPassengerOutput));

  const result = await usecase.execute(validPassengerInput);

  assert(result.isOk);
  expect(result.value).toStrictEqual(validPassengerOutput);
});

test("should return an error on cpf conflict", async () => {
  const expectedError = new AppError(
    "resourceConflict",
    `passenger with cpf ${validPassengerInput.cpf} already exists`,
  );
  repo.getByCpf.mockResolvedValue(R.ok(validPassengerOutput));

  const result = await usecase.execute(validPassengerInput);

  assert(result.isError);
  expect(result.error).toStrictEqual(expectedError);
});

test("should return an error if cpf conflict check throws", async () => {
  const expectedError = new AppError("databaseError", "database exploded");
  repo.getByCpf.mockResolvedValue(R.error(expectedError));

  const result = await usecase.execute(validPassengerInput);

  assert(result.isError);
  expect(result.error).toStrictEqual(expectedError);
});

test("should return an error if repository fails to create passenger", async () => {
  const expectedError = new AppError("databaseError", "database exploded");
  repo.getByCpf.mockResolvedValue(R.ok(null));
  repo.create.mockResolvedValue(R.error(expectedError));

  const result = await usecase.execute(validPassengerInput);

  assert(result.isError);
  expect(result.error).toStrictEqual(expectedError);
});
