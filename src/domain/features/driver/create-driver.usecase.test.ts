import assert from "node:assert/strict";
import { beforeEach, expect, test } from "@jest/globals";
import { type MockProxy, mock } from "jest-mock-extended";
import { validDriverInput, validDriverOutput } from "@/domain/__fixtures";
import { CreateDriverUseCase } from "@/domain/features/driver/create-driver.usecase";
import type { DriverRepository } from "@/domain/features/driver/driver.repository";
import { AppError } from "@/domain/utils/app-error";
import { R } from "@/domain/utils/result";

let repo: MockProxy<DriverRepository>;
let usecase: CreateDriverUseCase;

beforeEach(() => {
  repo = mock<DriverRepository>();
  usecase = new CreateDriverUseCase(repo);
});

test("should return a valid driver", async () => {
  repo.create.mockResolvedValue(R.ok(validDriverOutput));

  const result = await usecase.execute(validDriverInput);

  assert(result.isOk);
  expect(result.value).toStrictEqual(validDriverOutput);
});

test("should return an error if repository fails to create driver", async () => {
  const expectedError = new AppError("databaseError", "database exploded");
  repo.create.mockResolvedValue(R.error(expectedError));

  const result = await usecase.execute(validDriverInput);

  assert(result.isError);
  expect(result.error).toStrictEqual(expectedError);
});
