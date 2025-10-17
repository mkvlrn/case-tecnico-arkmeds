import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type { CreateFareSchema } from "@/adapters/api/validation-schemas/fare.schema";
import type { CreateFareUseCase } from "@/domain/features/fare/create-fare.usecase";

type CustomRequest = Request<unknown, unknown, CreateFareSchema>;

export class CreateFareController {
  private readonly usecase: CreateFareUseCase;

  constructor(usecase: CreateFareUseCase) {
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
