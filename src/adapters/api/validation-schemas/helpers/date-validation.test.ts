import assert from "node:assert/strict";
import { describe, expect, test } from "@jest/globals";
import { createDateOfBirthValidation } from "./date-validation";

describe("createDateOfBirthValidation", () => {
  test("should accept valid date that meets age requirement", () => {
    const schema = createDateOfBirthValidation(18, "Must be 18+");
    const twentyYearsAgo = new Date();
    twentyYearsAgo.setFullYear(twentyYearsAgo.getFullYear() - 20);

    const result = schema.safeParse(twentyYearsAgo.toISOString().slice(0, 10));

    expect(result.success).toBeTruthy();
  });

  test("should reject invalid date format", () => {
    const schema = createDateOfBirthValidation(18, "Must be 18+");

    const result = schema.safeParse("invalid-date");

    expect(result.success).toBeFalsy();
  });

  test("should reject date below minimum age", () => {
    const schema = createDateOfBirthValidation(18, "Must be 18+");
    const tenYearsAgo = new Date();
    tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);

    const result = schema.safeParse(tenYearsAgo.toISOString().slice(0, 10));

    assert(!result.success);
    expect(result.error.issues[0]?.message).toBe("Must be 18+");
  });
});
