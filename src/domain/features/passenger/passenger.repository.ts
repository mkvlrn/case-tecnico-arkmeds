import type { CreatePassengerSchema } from "@/adapters/api/validation-schemas/passenger.schema";
import type { Passenger } from "@/domain/features/passenger/passenger.model";
import type { AppError } from "@/domain/utils/app-error";
import type { AsyncResult } from "@/domain/utils/result";

export interface PassengerRepository {
  create(input: CreatePassengerSchema): AsyncResult<Passenger, AppError>;
  getAll(page: number): AsyncResult<Passenger[], AppError>;
  getById(id: string): AsyncResult<Passenger | null, AppError>;
  getByCpf(cpf: string): AsyncResult<Passenger | null, AppError>;
  update(id: string, input: CreatePassengerSchema): AsyncResult<Passenger, AppError>;
  delete(id: string): AsyncResult<true, AppError>;
  count(): AsyncResult<number, AppError>;
}
