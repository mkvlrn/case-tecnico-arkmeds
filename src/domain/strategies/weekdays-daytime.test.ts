import { expect, test } from "@jest/globals";
import { WeekdaysDaytimeFareStrategy } from "@/domain/strategies/weekdays-daytime";

const strategy = new WeekdaysDaytimeFareStrategy();

test("should match a weekday during daytime", () => {
  const date = new Date("2025-10-20T09:00:00-03:00"); // monday 09:00

  expect(strategy.matches(date)).toBe(true);
});

test("should not match a weekday outside daytime", () => {
  const date = new Date("2025-10-20T07:00:00-03:00"); // monday 07:00

  expect(strategy.matches(date)).toBe(false);
});

test("should not match a weekend", () => {
  const date = new Date("2025-10-18T10:00:00-03:00"); // saturday 10:00

  expect(strategy.matches(date)).toBe(false);
});

test("should have the correct price", () => {
  expect(strategy.price).toBe(2.8);
});
