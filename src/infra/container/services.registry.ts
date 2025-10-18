import type { AwilixContainer } from "awilix";
import { asClass, asFunction } from "awilix";
import { FarePriceCalculator } from "@/domain/services/fare-price-calculator";
import { WeekdaysDaytimeFareStrategy } from "@/domain/strategies/weekdays-daytime";
import { WeekdaysEveningFareStrategy } from "@/domain/strategies/weekdays-evening";
import { WeekdaysNightFareStrategy } from "@/domain/strategies/weekdays-night";
import { WeekendsDaytimeFareStrategy } from "@/domain/strategies/weekends-daytime";
import { WeekendsEveningFareStrategy } from "@/domain/strategies/weekends-evening";
import { WeekendsNightFareStrategy } from "@/domain/strategies/weekends-night";
import type { AppContainer } from "@/infra/container/types";

export function registerServices(container: AwilixContainer<AppContainer>) {
  container.register({
    // fare strategies
    weekdaysDaytimeFareStrategy: asClass(WeekdaysDaytimeFareStrategy).singleton(),
    weekdaysEveningFareStrategy: asClass(WeekdaysEveningFareStrategy).singleton(),
    weekdaysNightFareStrategy: asClass(WeekdaysNightFareStrategy).singleton(),
    weekendsDaytimeFareStrategy: asClass(WeekendsDaytimeFareStrategy).singleton(),
    weekendsEveningFareStrategy: asClass(WeekendsEveningFareStrategy).singleton(),
    weekendsNightFareStrategy: asClass(WeekendsNightFareStrategy).singleton(),

    // fare calculator service
    farePriceCalculator: asFunction(
      ({
        weekdaysDaytimeFareStrategy,
        weekdaysEveningFareStrategy,
        weekdaysNightFareStrategy,
        weekendsDaytimeFareStrategy,
        weekendsEveningFareStrategy,
        weekendsNightFareStrategy,
      }: AppContainer) =>
        new FarePriceCalculator([
          weekdaysDaytimeFareStrategy,
          weekdaysEveningFareStrategy,
          weekdaysNightFareStrategy,
          weekendsDaytimeFareStrategy,
          weekendsEveningFareStrategy,
          weekendsNightFareStrategy,
        ]),
    ).singleton(),
  });
}
