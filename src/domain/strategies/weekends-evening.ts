import { BaseFareStrategy } from "@/domain/strategies/base-fare-strategy";

export class WeekendsEveningFareStrategy extends BaseFareStrategy {
  readonly price = 4.1;

  constructor() {
    super([0, 6], 17, 20);
  }
}
