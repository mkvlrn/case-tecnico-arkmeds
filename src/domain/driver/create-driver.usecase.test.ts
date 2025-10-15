import assert from "node:assert/strict";
import { beforeEach, expect, test } from "@jest/globals";
import { type MockProxy, mock } from "jest-mock-extended";
import type { CreateDriverSchema } from "@/adapters/api/driver/create-driver.schema";
import { CreateDriverUseCase } from "@/domain/driver/create-driver.usecase";
import type { Driver } from "@/domain/driver/driver.entity";
import type { UserRepository } from "@/domain/misc/user.repository";
import { AppError } from "@/domain/utils/app-error";
import { R } from "@/domain/utils/result";

const validDriverInput = {
  name: "Test Driver",
  cpf: "12345678900",
  age: 42,
  gender: "female",
  address: "Hollywood Drive 42, Los Angeles, CA",
  phone: "(123) 456-7890",
  vehicle: "",
} satisfies CreateDriverSchema;

const validDriverOutput = {
  id: "test-id",
  ...validDriverInput,
} satisfies Driver;

let repo: MockProxy<UserRepository<Driver, CreateDriverSchema>>;
let usecase: CreateDriverUseCase;

beforeEach(() => {
  repo = mock<UserRepository<Driver, CreateDriverSchema>>();
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
