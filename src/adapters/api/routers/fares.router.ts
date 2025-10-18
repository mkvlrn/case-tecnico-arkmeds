import type { RedisClientType } from "@redis/client";
import { CreateFareController } from "@/adapters/api/controllers/fares/create-fare.controller";
import { createCrudRouter } from "@/adapters/api/factories/crud-router.factory";
import { CreateFareSchema } from "@/adapters/api/validation-schemas/fare.schema";
import { CreateFareUseCase } from "@/domain/features/fare/create-fare.usecase";
import { FarePriceCalculator } from "@/domain/services/fare-price-calculator";
import { WeekdaysDaytimeFareStrategy } from "@/domain/strategies/weekdays-daytime";
import { WeekdaysEveningFareStrategy } from "@/domain/strategies/weekdays-evening";
import { WeekdaysNightFareStrategy } from "@/domain/strategies/weekdays-night";
import { WeekendsDaytimeFareStrategy } from "@/domain/strategies/weekends-daytime";
import { WeekendsEveningFareStrategy } from "@/domain/strategies/weekends-evening";
import { WeekendsNightFareStrategy } from "@/domain/strategies/weekends-night";
import { RedisFaresRepo } from "@/infra/redis/fare.redis-repo";

export function getFaresRouter(redis: RedisClientType, faresTtl: number) {
  const repo = new RedisFaresRepo(redis, faresTtl);
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
