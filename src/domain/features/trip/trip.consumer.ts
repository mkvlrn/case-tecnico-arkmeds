import type { Trip } from "@/domain/features/trip/trip.model";

export interface TripConsumer {
  consume(handler: (trip: Trip) => Promise<void>): Promise<void>;
}
