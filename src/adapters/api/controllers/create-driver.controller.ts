import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type { CreateDriverSchema } from "@/adapters/api/validation-schemas/driver.schema";
import type { CreateDriverUseCase } from "@/domain/features/driver/create-driver.usecase";

type CustomRequest = Request<unknown, unknown, CreateDriverSchema>;

export class CreateDriverController {
  private readonly usecase: CreateDriverUseCase;

  constructor(usecase: CreateDriverUseCase) {
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
