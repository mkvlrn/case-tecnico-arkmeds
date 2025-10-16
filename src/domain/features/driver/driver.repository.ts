import type { CreateDriverSchema } from "@/adapters/api/validation-schemas/driver.schema";
import type { Driver } from "@/domain/features/driver/driver.model";
import type { AppError } from "@/domain/utils/app-error";
import type { AsyncResult } from "@/domain/utils/result";

export interface DriverRepository {
  create(input: CreateDriverSchema): AsyncResult<Driver, AppError>;
  getAll(page: number): AsyncResult<Driver[], AppError>;
  getById(id: string): AsyncResult<Driver | null, AppError>;
  update(id: string, input: CreateDriverSchema): AsyncResult<Driver, AppError>;
  delete(id: string): AsyncResult<true, AppError>;
  count(): AsyncResult<number, AppError>;
}
