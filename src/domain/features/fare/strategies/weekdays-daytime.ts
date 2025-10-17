import { BaseFareStrategy } from "@/domain/features/fare/strategies/base-fare-strategy";

export class WeekdaysDaytimeFareStrategy extends BaseFareStrategy {
  readonly price = 2.8;

  constructor() {
    super([1, 2, 3, 4, 5], 8, 17);
  }
}
