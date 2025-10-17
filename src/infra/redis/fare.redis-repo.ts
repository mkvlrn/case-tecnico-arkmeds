import type { RedisClientType } from "@redis/client";
import type { Fare } from "@/domain/features/fare/fare.model";
import type { FareRepository } from "@/domain/features/fare/fare.repository";
import { AppError } from "@/domain/utils/app-error";
import { type AsyncResult, R } from "@/domain/utils/result";

export class RedisRepo implements FareRepository {
  private readonly redis: RedisClientType;

  constructor(redis: RedisClientType) {
    this.redis = redis;
  }

  async create(fare: Fare): AsyncResult<Fare, AppError> {
    try {
      await this.redis.set(fare.id, JSON.stringify(fare));
      return R.ok(fare);
    } catch (err) {
      const msg = (err as Error).message;
      return R.error(new AppError("databaseError", msg, err));
    }
  }
  async get(id: string): AsyncResult<Fare, AppError> {
    try {
      const fare = await this.redis.get(id);
      if (!fare) {
        return R.error(new AppError("resourceNotFound", `fare with id ${id} not found`));
      }

      const parsed = JSON.parse(fare) as Fare;

      return R.ok({
        ...parsed,
        datetime: new Date(parsed.datetime),
      });
    } catch (err) {
      const msg = (err as Error).message;
      return R.error(new AppError("databaseError", msg, err));
    }
  }
}
