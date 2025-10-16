import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type { Driver } from "@/domain/features/driver/driver.model";
import type { GetDriverByIdUseCase } from "@/domain/features/driver/get-driver-by-id.usecase";

type CustomRequest = Request<{ id: string }, Driver, unknown>;

export class GetDriverByIdController {
  private readonly usecase: GetDriverByIdUseCase;

  constructor(usecase: GetDriverByIdUseCase) {
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
