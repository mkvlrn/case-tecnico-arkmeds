import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type { CreateUserSchema } from "@/adapters/api/validation-schemas/user.schema";
import type { BaseUser } from "@/domain/shared/base-user.model";
import type { BaseUserRepository } from "@/domain/shared/base-user.repository";
import type { UpdateBaseUserUseCase } from "@/domain/shared/update-base-user.usecase";

export abstract class UpdateBaseUserController<
  TModel extends BaseUser,
  TCreateSchema extends CreateUserSchema,
  TRepository extends BaseUserRepository<TModel, TCreateSchema>,
  TUseCase extends UpdateBaseUserUseCase<TModel, TCreateSchema, TRepository>,
> {
  protected readonly usecase: TUseCase;

  constructor(usecase: TUseCase) {
    this.usecase = usecase;
  }

  async handle(
    req: Request<{ id: string }, unknown, TCreateSchema>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const result = await this.usecase.execute(req.params.id, req.body);
    if (result.isError) {
      return next(result.error);
    }

    res.status(StatusCodes.OK).json(result.value);
  }
}
