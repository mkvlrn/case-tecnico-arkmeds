import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type { CreateDriverSchema } from "@/adapters/api/validation-schemas/driver.schema";
import type { UpdateDriverUseCase } from "@/domain/features/driver/update-driver.usecase";

type CustomRequest = Request<{ id: string }, unknown, CreateDriverSchema>;

export class UpdateDriverController {
  private readonly usecase: UpdateDriverUseCase;

  constructor(usecase: UpdateDriverUseCase) {
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
