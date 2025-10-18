import type { Fare } from "@/domain/features/fare/fare.model";
import type { AppError } from "@/domain/utils/app-error";
import type { AsyncResult } from "@/domain/utils/result";

export interface FareRepository {
  create(fare: Fare): AsyncResult<Fare, AppError>;
  get(id: string): AsyncResult<Fare | null, AppError>;
  delete(id: string): AsyncResult<true, AppError>;
}
