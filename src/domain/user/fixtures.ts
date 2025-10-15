import type { PaginationResult } from "@/domain/utils/pagination-result";

export interface TestUser {
  id: string;
  name: string;
}

export interface TestSchema {
  name: string;
}

export const validUserInput = {
  name: "test-name",
} satisfies TestSchema;

export const validUserOutput = {
  id: "test-id",
  name: "test-name",
} satisfies TestUser;

export const validUserPaginationResult = {
  total: 1,
  totalPages: 1,
  page: 1,
  items: [validUserOutput],
} satisfies PaginationResult<TestUser>;
