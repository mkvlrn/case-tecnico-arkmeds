import { expect, test } from "@jest/globals";
import { WeekdaysEveningFareStrategy } from "@/domain/features/fare/strategies/weekdays-evening";

const strategy = new WeekdaysEveningFareStrategy();

test("should match a weekday during evening", () => {
  const date = new Date("2025-10-20T18:00:00-03:00"); // monday 18:00
  expect(strategy.matches(date)).toBe(true);
});

test("should not match a weekday outside evening", () => {
  const date = new Date("2025-10-20T16:00:00-03:00"); // monday 16:00
  expect(strategy.matches(date)).toBe(false);
});

test("should not match a weekend", () => {
  const date = new Date("2025-10-18T18:00:00-03:00"); // saturday 18:00
  expect(strategy.matches(date)).toBe(false);
});

test("should have the correct price", () => {
  expect(strategy.price).toBe(3.5);
});
