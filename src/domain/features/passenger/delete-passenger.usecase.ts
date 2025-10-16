import type { PassengerRepository } from "@/domain/features/passenger/passenger.repository";
import { AppError } from "@/domain/utils/app-error";
import { type AsyncResult, R } from "@/domain/utils/result";

export class DeletePassengerUseCase {
  private readonly passengerRepository: PassengerRepository;

  constructor(passengerRepository: PassengerRepository) {
    this.passengerRepository = passengerRepository;
  }

  async execute(id: string): AsyncResult<true, AppError> {
    const existing = await this.passengerRepository.getById(id);
    if (existing.isError) {
      return R.error(existing.error);
    }
    if (existing.value === null) {
      return R.error(new AppError("resourceNotFound", `passenger with id ${id} not found`));
    }

    return await this.passengerRepository.delete(id);
  }
}
