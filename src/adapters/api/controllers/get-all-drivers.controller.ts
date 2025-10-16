import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { PaginatedResultQuery } from "@/adapters/api/validation-schemas/paginated-result.schema";
import type { GetAllDriversUseCase } from "@/domain/features/driver/get-all-drivers.usecase";

export class GetAllDriversController {
  private readonly usecase: GetAllDriversUseCase;

  constructor(usecase: GetAllDriversUseCase) {
    this.usecase = usecase;
  }

  async handle(req: Request, res: Response, next: NextFunction) {
    const { page } = PaginatedResultQuery.parse(req.query);
    const result = await this.usecase.execute(page);
    if (result.isError) {
      return next(result.error);
    }

    res.status(StatusCodes.OK).json(result.value);
  }
}
