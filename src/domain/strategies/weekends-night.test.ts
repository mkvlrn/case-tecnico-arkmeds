import { expect, test } from "@jest/globals";
import { WeekendsNightFareStrategy } from "@/domain/strategies/weekends-night";

const strategy = new WeekendsNightFareStrategy();

test("should match a weekend during night", () => {
  const date = new Date("2025-10-19T00:00:00Z"); // sunday 00:00 UTC (saturday 21:00 UTC-3)
  expect(strategy.matches(date)).toBe(true);
});

test("should not match a weekend outside night", () => {
  const date = new Date("2025-10-18T19:00:00Z"); // saturday 19:00 UTC (16:00 UTC-3)
  expect(strategy.matches(date)).toBe(false);
});

test("should not match a weekday", () => {
  const date = new Date("2025-10-21T00:00:00Z"); // tuesday 00:00 UTC (monday 21:00 UTC-3)
  expect(strategy.matches(date)).toBe(false);
});

test("should have the correct price", () => {
  expect(strategy.price).toBe(3.5);
});
