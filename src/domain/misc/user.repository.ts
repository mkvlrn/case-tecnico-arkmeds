import type { AppError } from "@/domain/utils/app-error";
import type { AsyncResult } from "@/domain/utils/result";

export interface UserRepository<T, S = never> {
  create(input: S): AsyncResult<T, AppError>;
  getAll(page: number): AsyncResult<T[], AppError>;
  getById(id: string): AsyncResult<T, AppError>;
  update(id: string, input: S): AsyncResult<T, AppError>;
  delete(id: string): AsyncResult<void, AppError>;
  count(): AsyncResult<number, AppError>;
}
