import type { Passenger } from "@/domain/features/passenger/passenger.model";
import type { PassengerRepository } from "@/domain/features/passenger/passenger.repository";
import type { AppError } from "@/domain/utils/app-error";
import { PaginationResult } from "@/domain/utils/pagination-result";
import { type AsyncResult, R } from "@/domain/utils/result";

export class GetAllPassengersUseCase {
  private readonly passengerRepository: PassengerRepository;

  constructor(passengerRepository: PassengerRepository) {
    this.passengerRepository = passengerRepository;
  }

  async execute(page = 1): AsyncResult<PaginationResult<Passenger>, AppError> {
    const total = await this.passengerRepository.count();
    if (total.isError) {
      return R.error(total.error);
    }

    const passengers = await this.passengerRepository.getAll(page);
    if (passengers.isError) {
      return R.error(passengers.error);
    }

    return R.ok(new PaginationResult(total.value, page, passengers.value));
  }
}
