import assert from "node:assert/strict";
import { expect, test } from "@jest/globals";
import type { CreateFareSchema } from "@/adapters/api/validation-schemas/fare.schema";
import { FarePriceCalculator } from "@/domain/services/fare-price-calculator";
import { WeekdaysDaytimeFareStrategy } from "@/domain/strategies/weekdays-daytime";

const strategies = [new WeekdaysDaytimeFareStrategy()];
const calculator = new FarePriceCalculator(strategies);

const fare: CreateFareSchema = {
  originLatitude: -22.298_475,
  originLongitude: -42.537_458,
  destinationLatitude: -15.597_321,
  destinationLongitude: -56.082_842,
  datetime: "2025-10-20T12:00:00Z", // 12:00 UTC (09:00 UTC-3)
};

test("should calculate price correctly for a matching strategy", () => {
  const datetime = new Date("2025-10-20T12:00:00Z"); // monday 12:00 UTC (09:00 UTC-3)
  const result = calculator.calculate(fare, datetime);

  assert(result.isOk);
  const [distanceInKm, price] = result.value;
  // distance ~1606.4 km * 2.8 = ~4497.92
  expect(distanceInKm).toBeCloseTo(1606.4, 1);
  expect(price).toBeCloseTo(4497.92, 1);
});

test("should return error if no strategy matches", () => {
  const datetime = new Date("2025-10-20T07:00:00Z"); // 07:00 UTC - outside strategy range (8-17)
  const result = calculator.calculate(fare, datetime);

  assert(result.isError);
  expect(result.error.message).toBe("could not create an estimation for given datetime");
});

test("should calculate approximate distance correctly", () => {
  const distance = (
    calculator as unknown as {
      haversineDistance: (lat1: number, lon1: number, lat2: number, lon2: number) => number;
    }
  ).haversineDistance(
    fare.originLatitude,
    fare.originLongitude,
    fare.destinationLatitude,
    fare.destinationLongitude,
  );
  expect(distance).toBeCloseTo(1606.4, 1);
});
