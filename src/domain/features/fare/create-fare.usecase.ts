import { randomUUID } from "node:crypto";
import type { CreateFareSchema } from "@/adapters/api/validation-schemas/fare.schema";
import type { Fare } from "@/domain/features/fare/fare.model";
import type { FareRepository } from "@/domain/features/fare/fare.repository";
import type { FarePriceCalculator } from "@/domain/features/fare/fare-price-calculator";
import { AppError } from "@/domain/utils/app-error";
import { type AsyncResult, R } from "@/domain/utils/result";

export class CreateFareUseCase {
  private readonly fareRepository: FareRepository;
  private readonly priceCalculator: FarePriceCalculator;

  constructor(fareRepository: FareRepository, priceCalculator: FarePriceCalculator) {
    this.fareRepository = fareRepository;
    this.priceCalculator = priceCalculator;
  }

  async execute(input: CreateFareSchema): AsyncResult<Fare, AppError> {
    const datetime = new Date(input.datetime);

    if (datetime.getTime() < Date.now()) {
      return R.error(new AppError("invalidInput", "datetime cannot be in the past"));
    }

    const price = this.priceCalculator.calculate(input, datetime);
    if (price.isError) {
      return R.error(price.error);
    }

    const fare = {
      id: randomUUID(),
      ...input,
      datetime: new Date(input.datetime),
      price: price.value,
    } satisfies Fare;

    return await this.fareRepository.create(fare);
  }
}
