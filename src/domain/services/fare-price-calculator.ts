import type { CreateFareSchema } from "@/adapters/api/validation-schemas/fare.schema";
import type { BaseFareStrategy } from "@/domain/strategies/base-fare-strategy";
import { AppError } from "@/domain/utils/app-error";
import { R, type Result } from "@/domain/utils/result";

export class FarePriceCalculator {
  private readonly strategies: BaseFareStrategy[];

  constructor(strategies: BaseFareStrategy[]) {
    this.strategies = strategies;
  }

  calculate(fare: CreateFareSchema, datetime: Date): Result<[number, number], AppError> {
    const strategy = this.strategies.find((strategy) => strategy.matches(datetime));
    if (!strategy) {
      return R.error(
        new AppError("invalidInput", "could not create an estimation for given datetime"),
      );
    }

    const distanceInKm = this.haversineDistance(
      fare.originLatitude,
      fare.originLongitude,
      fare.destinationLatitude,
      fare.destinationLongitude,
    );

    const price = distanceInKm * strategy.price;

    return R.ok([Math.round(distanceInKm * 100) / 100, Math.round(price * 100) / 100]);
  }

  private haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    // https://en.wikipedia.org/wiki/Haversine_formula
    const earthRadiusKm = 6371;

    const deltaLat = this.toRadians(lat2 - lat1);
    const deltaLon = this.toRadians(lon2 - lon1);

    const radLat1 = this.toRadians(lat1);
    const radLat2 = this.toRadians(lat2);

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadiusKm * c;

    return distance;
  }

  private toRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }
}
