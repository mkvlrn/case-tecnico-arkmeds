import { BaseFareStrategy } from "@/domain/features/fare/strategies/base-fare-strategy";

export class WeekdaysNightFareStrategy extends BaseFareStrategy {
  readonly price = 3.1;

  constructor() {
    super([1, 2, 3, 4, 5], 20, 8);
  }
}
