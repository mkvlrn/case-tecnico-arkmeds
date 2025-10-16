import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type { CreatePassengerSchema } from "@/adapters/api/validation-schemas/passenger.schema";
import type { CreatePassengerUseCase } from "@/domain/features/passenger/create-passenger.usecase";

type CustomRequest = Request<unknown, unknown, CreatePassengerSchema>;

export class CreatePassengerController {
  private readonly usecase: CreatePassengerUseCase;

  constructor(usecase: CreatePassengerUseCase) {
    this.usecase = usecase;
  }

  async handle(req: CustomRequest, res: Response, next: NextFunction) {
    const result = await this.usecase.execute(req.body);
    if (result.isError) {
      return next(result.error);
    }

    res.status(StatusCodes.CREATED).json(result.value);
  }
}
