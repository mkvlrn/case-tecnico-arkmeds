import type { CreateDriverSchema } from "@/adapters/api/validation-schemas/driver.schema";
import type { CreatePassengerSchema } from "@/adapters/api/validation-schemas/passenger.schema";
import type { Driver } from "@/domain/features/driver/driver.model";
import type { Passenger } from "@/domain/features/passenger/passenger.model";
import type { AppError } from "@/domain/utils/app-error";
import type { AsyncResult } from "@/domain/utils/result";

export interface BaseUserRepository<TEntity, TCreateSchema> {
  create(input: TCreateSchema): AsyncResult<TEntity, AppError>;
  getAll(page: number): AsyncResult<TEntity[], AppError>;
  getById(id: string): AsyncResult<TEntity | null, AppError>;
  getByCpf(cpf: string): AsyncResult<TEntity | null, AppError>;
  update(id: string, input: TCreateSchema): AsyncResult<TEntity, AppError>;
  delete(id: string): AsyncResult<true, AppError>;
  count(): AsyncResult<number, AppError>;
}

export interface DriverRepository extends BaseUserRepository<Driver, CreateDriverSchema> {}
export interface PassengerRepository extends BaseUserRepository<Passenger, CreatePassengerSchema> {}
