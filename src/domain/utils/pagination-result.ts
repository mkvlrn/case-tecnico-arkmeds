export interface PaginationResult<T> {
  total: number;
  totalPages: number;
  page: number;
  items: T[];
}
