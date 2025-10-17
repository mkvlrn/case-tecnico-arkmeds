import type { Trip } from "@/domain/features/trip/trip.model";

export interface TripNotifier {
  notify(trip: Trip): void;
}
