import { BaseFareStrategy } from "@/domain/strategies/base-fare-strategy";

export class WeekdaysEveningFareStrategy extends BaseFareStrategy {
  readonly price = 3.5;

  constructor() {
    super([1, 2, 3, 4, 5], 17, 20);
  }
}
