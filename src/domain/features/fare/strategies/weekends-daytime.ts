import { BaseFareStrategy } from "@/domain/features/fare/strategies/base-fare-strategy";

export class WeekendsDaytimeFareStrategy extends BaseFareStrategy {
  readonly price = 3.0;

  constructor() {
    super([0, 6], 8, 17);
  }
}
