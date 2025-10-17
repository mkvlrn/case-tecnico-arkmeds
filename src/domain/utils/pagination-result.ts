import { USERS_PER_PAGE } from "@/domain/utils/constants";

export class PaginationResult<T> {
  readonly total: number;
  readonly totalPages: number;
  readonly page: number;
  readonly items: T[];

  constructor(total: number, page: number, items: T[]) {
    this.total = total;
    this.page = page;
    this.totalPages = Math.ceil(total / USERS_PER_PAGE);
    this.items = items;
  }
}
