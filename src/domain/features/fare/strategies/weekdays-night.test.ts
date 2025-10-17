import { expect, test } from "@jest/globals";
import { WeekdaysNightFareStrategy } from "@/domain/features/fare/strategies/weekdays-night";

const strategy = new WeekdaysNightFareStrategy();

test("should match a weekday during night", () => {
  const date = new Date("2025-10-20T21:00:00-03:00"); // monday 21:00
  expect(strategy.matches(date)).toBe(true);
});

test("should not match a weekday outside night", () => {
  const date = new Date("2025-10-20T19:00:00-03:00"); // monday 19:00
  expect(strategy.matches(date)).toBe(false);
});

test("should not match a weekend", () => {
  const date = new Date("2025-10-18T22:00:00-03:00"); // saturday 22:00
  expect(strategy.matches(date)).toBe(false);
});

test("should have the correct price", () => {
  expect(strategy.price).toBe(3.1);
});
