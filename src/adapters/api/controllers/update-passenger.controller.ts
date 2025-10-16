import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type { CreatePassengerSchema } from "@/adapters/api/validation-schemas/passenger.schema";
import type { UpdatePassengerUseCase } from "@/domain/features/passenger/update-passenger.usecase";

type CustomRequest = Request<{ id: string }, unknown, CreatePassengerSchema>;

export class UpdatePassengerController {
  private readonly usecase: UpdatePassengerUseCase;

  constructor(usecase: UpdatePassengerUseCase) {
    this.usecase = usecase;
  }

  async handle(req: CustomRequest, res: Response, next: NextFunction) {
    const result = await this.usecase.execute(req.params.id, req.body);
    if (result.isError) {
      return next(result.error);
    }

    res.status(StatusCodes.OK).json(result.value);
  }
}
