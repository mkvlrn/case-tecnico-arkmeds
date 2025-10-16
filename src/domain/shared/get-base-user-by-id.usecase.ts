import type { BaseUser } from "@/domain/shared/base-user.model";
import type { BaseUserRepository } from "@/domain/shared/base-user.repository";
import { AppError } from "@/domain/utils/app-error";
import { type AsyncResult, R } from "@/domain/utils/result";
import type { Prisma } from "@/generated/prisma/client";

export abstract class GetByIdBaseUserUseCase<
  TModel extends BaseUser,
  TRepository extends BaseUserRepository<TModel>,
> {
  protected readonly repository: TRepository;
  protected readonly modelName: Uncapitalize<Prisma.ModelName>;

  constructor(repository: TRepository, modelName: Uncapitalize<Prisma.ModelName>) {
    this.repository = repository;
    this.modelName = modelName;
  }

  async execute(id: string): AsyncResult<TModel, AppError> {
    const existing = await this.repository.getById(id);
    if (existing.isError) {
      return R.error(existing.error);
    }
    if (existing.value === null) {
      return R.error(new AppError("resourceNotFound", `${this.modelName} with id ${id} not found`));
    }

    return R.ok(existing.value);
  }
}
