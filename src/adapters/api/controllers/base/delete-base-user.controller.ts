import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type { BaseUser } from "@/domain/shared/base-user.model";
import type { BaseUserRepository } from "@/domain/shared/base-user.repository";
import type { DeleteBaseUserUseCase } from "@/domain/shared/delete-base-user.usecase";

export abstract class DeleteBaseUserController<
  TModel extends BaseUser,
  TRepository extends BaseUserRepository<TModel>,
  TUseCase extends DeleteBaseUserUseCase<TModel, TRepository>,
> {
  protected readonly usecase: TUseCase;

  constructor(usecase: TUseCase) {
    this.usecase = usecase;
  }

  async handle(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
    const result = await this.usecase.execute(req.params.id);
    if (result.isError) {
      return next(result.error);
    }

    res.status(StatusCodes.NO_CONTENT).send();
  }
}
