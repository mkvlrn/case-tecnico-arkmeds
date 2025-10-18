import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type { CreateTripSchema } from "@/adapters/api/validation-schemas/trip.schema";
import type { CreateTripUseCase } from "@/domain/features/trip/create-trip.usecase";

type CustomRequest = Request<unknown, unknown, CreateTripSchema>;

export class CreateTripController {
  private readonly usecase: CreateTripUseCase;

  constructor(usecase: CreateTripUseCase) {
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
