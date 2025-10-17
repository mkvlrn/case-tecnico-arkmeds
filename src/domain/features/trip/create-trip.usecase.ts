import type { CreateTripSchema } from "@/adapters/api/validation-schemas/trip.schema";
import type { Fare } from "@/domain/features/fare/fare.model";
import type { FareRepository } from "@/domain/features/fare/fare.repository";
import type { Trip } from "@/domain/features/trip/trip.model";
import type { TripNotifier } from "@/domain/features/trip/trip.notifier";
import type { PassengerRepository } from "@/domain/shared/base-user.repository";
import { AppError } from "@/domain/utils/app-error";
import { type AsyncResult, R } from "@/domain/utils/result";

export class CreateTripUseCase {
  private readonly passengerRepository: PassengerRepository;
  private readonly fareRepository: FareRepository;
  private readonly tripNotifier: TripNotifier;

  constructor(
    passengerRepository: PassengerRepository,
    fareRepository: FareRepository,
    tripNotifier: TripNotifier,
  ) {
    this.passengerRepository = passengerRepository;
    this.fareRepository = fareRepository;
    this.tripNotifier = tripNotifier;
  }

  async execute(request: CreateTripSchema): AsyncResult<Trip, AppError> {
    const passenger = await this.passengerRepository.getById(request.passengerId);
    if (passenger.isError) {
      return R.error(passenger.error);
    }
    if (passenger.value === null) {
      return R.error(
        new AppError("resourceNotFound", `passenger with id ${request.passengerId} not found`),
      );
    }

    const fare = await this.fareRepository.get(request.requestId);
    if (fare.isError) {
      return R.error(fare.error);
    }

    const trip = this.createReceipt(request, fare.value);
    this.tripNotifier.notify(trip);

    return R.ok(trip);
  }

  private createReceipt(request: CreateTripSchema, fare: Fare): Trip {
    return {
      passengerId: request.passengerId,
      datetime: fare.datetime,
      distanceInKm: fare.distanceInKm,
      price: fare.price,
    };
  }
}
