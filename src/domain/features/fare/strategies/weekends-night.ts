import { BaseFareStrategy } from "@/domain/features/fare/strategies/base-fare-strategy";

export class WeekendsNightFareStrategy extends BaseFareStrategy {
  readonly price = 3.5;

  constructor() {
    super([0, 6], 20, 8);
  }
}
