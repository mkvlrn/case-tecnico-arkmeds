import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { PaginatedResultQuery } from "@/adapters/api/validation-schemas/paginated-result.schema";
import type { GetAllPassengersUseCase } from "@/domain/features/passenger/get-all-passengers.usecase";

export class GetAllPassengersController {
  private readonly usecase: GetAllPassengersUseCase;

  constructor(usecase: GetAllPassengersUseCase) {
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
