import type { CreateFareSchema } from "@/adapters/api/validation-schemas/fare.schema";
import type { Fare } from "@/domain/features/fare/fare.model";
import type { AppError } from "@/domain/utils/app-error";
import type { AsyncResult } from "@/domain/utils/result";

export interface FareRepository {
  createFare(fare: CreateFareSchema): AsyncResult<Fare, AppError>;
}
