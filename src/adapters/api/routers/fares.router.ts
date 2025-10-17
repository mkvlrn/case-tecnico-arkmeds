import type { RedisClientType } from "@redis/client";
import { CreateFareController } from "@/adapters/api/controllers/fares/create-fare.controller";
import { createCrudRouter } from "@/adapters/api/factories/crud-router.factory";
import { CreateFareSchema } from "@/adapters/api/validation-schemas/fare.schema";
import { CreateFareUseCase } from "@/domain/features/fare/create-fare.usecase";
import { FarePriceCalculator } from "@/domain/features/fare/fare-price-calculator";
import { WeekdaysDaytimeFareStrategy } from "@/domain/features/fare/strategies/weekdays-daytime";
import { WeekdaysEveningFareStrategy } from "@/domain/features/fare/strategies/weekdays-evening";
import { WeekdaysNightFareStrategy } from "@/domain/features/fare/strategies/weekdays-night";
import { WeekendsDaytimeFareStrategy } from "@/domain/features/fare/strategies/weekends-daytime";
import { WeekendsEveningFareStrategy } from "@/domain/features/fare/strategies/weekends-evening";
import { WeekendsNightFareStrategy } from "@/domain/features/fare/strategies/weekends-night";
import { RedisFaresRepo } from "@/infra/redis/fare.redis-repo";

export function getFaresRouter(redis: RedisClientType) {
  const repo = new RedisFaresRepo(redis);
  const priceCalculator = new FarePriceCalculator([
    new WeekdaysDaytimeFareStrategy(),
    new WeekdaysEveningFareStrategy(),
    new WeekdaysNightFareStrategy(),
    new WeekendsDaytimeFareStrategy(),
    new WeekendsEveningFareStrategy(),
    new WeekendsNightFareStrategy(),
  ]);
  const usecase = new CreateFareUseCase(repo, priceCalculator);

  return createCrudRouter({ create: new CreateFareController(usecase) }, CreateFareSchema);
}
