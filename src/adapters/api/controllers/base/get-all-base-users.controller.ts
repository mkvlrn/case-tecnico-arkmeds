import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { PaginatedResultQuery } from "@/adapters/api/validation-schemas/paginated-result.schema";
import type { BaseUser } from "@/domain/shared/base-user.model";
import type { BaseUserRepository } from "@/domain/shared/base-user.repository";
import type { GetAllBaseUserUseCase } from "@/domain/shared/get-all-base-users.usecase";

export abstract class GetAllBaseUsersController<
  TModel extends BaseUser,
  TRepository extends BaseUserRepository<TModel>,
  TUseCase extends GetAllBaseUserUseCase<TModel, TRepository>,
> {
  protected readonly usecase: TUseCase;

  constructor(usecase: TUseCase) {
    this.usecase = usecase;
  }

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { page } = PaginatedResultQuery.parse(req.query);
    const result = await this.usecase.execute(page);
    if (result.isError) {
      return next(result.error);
    }

    res.status(StatusCodes.OK).json(result.value);
  }
}
