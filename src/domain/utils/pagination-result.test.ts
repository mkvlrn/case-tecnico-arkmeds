import { expect, test } from "@jest/globals";
import { PaginationResult } from "@/domain/utils/pagination-result";

test("should correctly calculate totalPages and assign properties", () => {
  const items = [1, 2, 3];
  const result = new PaginationResult<number>(25, 2, items);

  expect(result.total).toBe(25);
  expect(result.page).toBe(2);
  expect(result.totalPages).toBe(3);
  expect(result.items).toEqual(items);
});

test("should handle zero total correctly", () => {
  const result = new PaginationResult<number>(0, 1, []);
  expect(result.totalPages).toBe(0);
  expect(result.items).toEqual([]);
});
