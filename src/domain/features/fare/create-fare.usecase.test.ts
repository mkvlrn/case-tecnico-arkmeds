import assert from "node:assert/strict";
import { beforeEach, expect, test } from "@jest/globals";
import { type DeepMockProxy, mockDeep } from "jest-mock-extended";
import type { CreateFareSchema } from "@/adapters/api/validation-schemas/fare.schema";
import { CreateFareUseCase } from "@/domain/features/fare/create-fare.usecase";
import type { Fare } from "@/domain/features/fare/fare.model";
import type { FareRepository } from "@/domain/features/fare/fare.repository";
import type { FarePriceCalculator } from "@/domain/features/fare/fare-price-calculator";
import { AppError } from "@/domain/utils/app-error";
import { R } from "@/domain/utils/result";

let fareRepository: DeepMockProxy<FareRepository>;
let priceCalculator: DeepMockProxy<FarePriceCalculator>;
let usecase: CreateFareUseCase;

beforeEach(() => {
  fareRepository = mockDeep<FareRepository>();
  priceCalculator = mockDeep<FarePriceCalculator>();
  usecase = new CreateFareUseCase(fareRepository, priceCalculator);
});

test("should create a fare successfully", async () => {
  const tempDate = new Date(Date.now() + 1000 * 60).toISOString(); // 1 minute in the future
  const input: CreateFareSchema = {
    originLatitude: -23.55,
    originLongitude: -46.63,
    destinationLatitude: -23.56,
    destinationLongitude: -46.64,
    datetime: tempDate,
  };
  priceCalculator.calculate.mockReturnValue(R.ok(10));
  fareRepository.create.mockResolvedValue(R.ok({ price: 10 } as Fare));

  const result = await usecase.execute(input);

  assert(result.isOk);
  expect(result.value.price).toBe(10);
  expect(fareRepository.create).toHaveBeenCalledWith(
    expect.objectContaining({
      id: expect.any(String),
      originLatitude: -23.55,
      originLongitude: -46.63,
      destinationLatitude: -23.56,
      destinationLongitude: -46.64,
      datetime: new Date(tempDate),
      price: 10,
    }),
  );
});

test("fails if datetime is in the past", async () => {
  const input: CreateFareSchema = {
    originLatitude: -23.55,
    originLongitude: -46.63,
    destinationLatitude: -23.56,
    destinationLongitude: -46.64,
    datetime: new Date(Date.now() - 1000 * 60).toISOString(), // 1 minute in the past
  };

  const result = await usecase.execute(input);

  assert(result.isError);
  expect(result.error.message).toBe("datetime cannot be in the past");
});

test("fails if price calculator returns error", async () => {
  const input: CreateFareSchema = {
    originLatitude: -23.55,
    originLongitude: -46.63,
    destinationLatitude: -23.56,
    destinationLongitude: -46.64,
    datetime: new Date(Date.now() + 1000 * 60).toISOString(),
  };
  priceCalculator.calculate.mockReturnValue(R.error(new AppError("invalidInput", "no strategy")));

  const result = await usecase.execute(input);

  assert(result.isError);
  expect(result.error.message).toBe("no strategy");
});
