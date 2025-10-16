import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type { GetPassengerByIdUseCase } from "@/domain/features/passenger/get-passenger-by-id.usecase";

type CustomRequest = Request<{ id: string }>;

export class GetPassengerByIdController {
  private readonly usecase: GetPassengerByIdUseCase;

  constructor(usecase: GetPassengerByIdUseCase) {
    this.usecase = usecase;
  }

  async handle(req: CustomRequest, res: Response, next: NextFunction) {
    const result = await this.usecase.execute(req.params.id);
    if (result.isError) {
      return next(result.error);
    }

    res.status(StatusCodes.OK).json(result.value);
  }
}
