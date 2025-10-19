import { expect, test } from "@jest/globals";
import { WeekdaysDaytimeFareStrategy } from "@/domain/strategies/weekdays-daytime";

const strategy = new WeekdaysDaytimeFareStrategy();

test("should match a weekday during daytime", () => {
  const date = new Date("2025-10-20T12:00:00Z"); // monday 12:00 UTC (09:00 UTC-3)

  expect(strategy.matches(date)).toBe(true);
});

test("should not match a weekday outside daytime", () => {
  const date = new Date("2025-10-20T07:00:00Z"); // monday 07:00 UTC (04:00 UTC-3)

  expect(strategy.matches(date)).toBe(false);
});

test("should not match a weekend", () => {
  const date = new Date("2025-10-18T13:00:00Z"); // saturday 13:00 UTC (10:00 UTC-3)

  expect(strategy.matches(date)).toBe(false);
});

test("should have the correct price", () => {
  expect(strategy.price).toBe(2.8);
});
