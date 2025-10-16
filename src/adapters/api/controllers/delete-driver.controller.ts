import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type { DeleteDriverUseCase } from "@/domain/features/driver/delete-driver.usecase";

type CustomRequest = Request<{ id: string }, unknown, unknown>;

export class DeleteDriverController {
  private readonly usecase: DeleteDriverUseCase;

  constructor(usecase: DeleteDriverUseCase) {
    this.usecase = usecase;
  }

  async handle(req: CustomRequest, res: Response, next: NextFunction) {
    const result = await this.usecase.execute(req.params.id);
    if (result.isError) {
      return next(result.error);
    }

    res.status(StatusCodes.NO_CONTENT).send();
  }
}
