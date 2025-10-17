import type { Trip } from "@/domain/features/trip/trip.model";
import type { AppError } from "@/domain/utils/app-error";
import type { AsyncResult } from "@/domain/utils/result";

export interface TripReceiptRepository {
  save(trip: Trip): AsyncResult<true, AppError>;
}
