import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type { DeletePassengerUseCase } from "@/domain/features/passenger/delete-passenger.usecase";

type CustomRequest = Request<{ id: string }>;

export class DeletePassengerController {
  private readonly usecase: DeletePassengerUseCase;

  constructor(usecase: DeletePassengerUseCase) {
    this.usecase = usecase;
  }

  async handle(req: CustomRequest, res: Response, next: NextFunction) {
    const result = await this.usecase.execute(req.params.id);
    if (result.isError) {
      return next(result.error);
    }

    res.status(StatusCodes.NO_CONTENT).send();
  }
}
