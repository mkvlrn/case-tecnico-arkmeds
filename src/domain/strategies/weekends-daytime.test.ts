import { expect, test } from "@jest/globals";
import { WeekendsDaytimeFareStrategy } from "@/domain/strategies/weekends-daytime";

const strategy = new WeekendsDaytimeFareStrategy();

test("should match a weekend during daytime", () => {
  const date = new Date("2025-10-18T10:00:00-03:00"); // saturday 10:00
  expect(strategy.matches(date)).toBe(true);
});

test("should not match a weekend outside daytime", () => {
  const date = new Date("2025-10-18T07:00:00-03:00"); // saturday 07:00
  expect(strategy.matches(date)).toBe(false);
});

test("should not match a weekday", () => {
  const date = new Date("2025-10-20T10:00:00-03:00"); // monday 10:00
  expect(strategy.matches(date)).toBe(false);
});

test("should have the correct price", () => {
  expect(strategy.price).toBe(3.0);
});
