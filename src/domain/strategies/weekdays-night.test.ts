import { expect, test } from "@jest/globals";
import { WeekdaysNightFareStrategy } from "@/domain/strategies/weekdays-night";

const strategy = new WeekdaysNightFareStrategy();

test("should match a weekday during night", () => {
  const date = new Date("2025-10-21T00:00:00Z"); // tuesday 00:00 UTC (monday 21:00 UTC-3)
  expect(strategy.matches(date)).toBe(true);
});

test("should not match a weekday outside night", () => {
  const date = new Date("2025-10-20T19:00:00Z"); // monday 19:00 UTC (16:00 UTC-3)
  expect(strategy.matches(date)).toBe(false);
});

test("should not match a weekend", () => {
  const date = new Date("2025-10-19T01:00:00Z"); // sunday 01:00 UTC (saturday 22:00 UTC-3)
  expect(strategy.matches(date)).toBe(false);
});

test("should have the correct price", () => {
  expect(strategy.price).toBe(3.1);
});
