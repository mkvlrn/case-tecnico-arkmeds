import type { RedisClientType } from "@redis/client";
import type { Fare } from "@/domain/features/fare/fare.model";
import type { FareRepository } from "@/domain/features/fare/fare.repository";
import { AppError } from "@/domain/utils/app-error";
import { type AsyncResult, R } from "@/domain/utils/result";

export class RedisFaresRepo implements FareRepository {
  private readonly redis: RedisClientType;
  private readonly faresTtl: number;

  constructor(redis: RedisClientType, faresTtl: number) {
    this.redis = redis;
    this.faresTtl = faresTtl;
  }

  async create(fare: Fare): AsyncResult<Fare, AppError> {
    try {
      await this.redis.set(fare.requestId, JSON.stringify(fare), {
        expiration: { type: "EX", value: this.faresTtl },
      });
      return R.ok(fare);
    } catch (err) {
      const msg = (err as Error).message;
      return R.error(new AppError("databaseError", msg, err));
    }
  }
  async get(id: string): AsyncResult<Fare | null, AppError> {
    try {
      const fare = await this.redis.get(id);
      if (!fare) {
        return R.ok(null);
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

  async delete(id: string): AsyncResult<true, AppError> {
    try {
      await this.redis.del(id);
      return R.ok(true);
    } catch (err) {
      const msg = (err as Error).message;
      return R.error(new AppError("databaseError", msg, err));
    }
  }
}
