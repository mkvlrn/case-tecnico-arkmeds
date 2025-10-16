import type { Passenger } from "@/domain/features/passenger/passenger.model";
import type { PassengerRepository } from "@/domain/features/passenger/passenger.repository";
import { AppError } from "@/domain/utils/app-error";
import { type AsyncResult, R } from "@/domain/utils/result";

export class GetPassengerByIdUseCase {
  private readonly passengerRepository: PassengerRepository;

  constructor(passengerRepository: PassengerRepository) {
    this.passengerRepository = passengerRepository;
  }

  async execute(id: string): AsyncResult<Passenger, AppError> {
    const passenger = await this.passengerRepository.getById(id);
    if (passenger.isError) {
      return R.error(passenger.error);
    }

    if (passenger.value === null) {
      const error = new AppError("resourceNotFound", `passenger with id ${id} not found`);
      return R.error(error);
    }

    return R.ok(passenger.value);
  }
}
