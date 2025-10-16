import type { CreateUserSchema } from "@/adapters/api/validation-schemas/user.schema";
import type { BaseUser } from "@/domain/shared/base-user.model";
import type { BaseUserRepository } from "@/domain/shared/base-user.repository";
import { AppError } from "@/domain/utils/app-error";
import { type AsyncResult, R } from "@/domain/utils/result";
import type { Prisma } from "@/generated/prisma/client";

export abstract class UpdateBaseUserUseCase<
  TModel extends BaseUser,
  TCreateSchema extends CreateUserSchema,
  TRepository extends BaseUserRepository<TModel, TCreateSchema>,
> {
  protected readonly repository: TRepository;
  protected readonly modelName: Uncapitalize<Prisma.ModelName>;

  constructor(repository: TRepository, modelName: Uncapitalize<Prisma.ModelName>) {
    this.repository = repository;
    this.modelName = modelName;
  }

  async execute(id: string, input: TCreateSchema): AsyncResult<TModel, AppError> {
    const existing = await this.repository.getById(id);
    if (existing.isError) {
      return R.error(existing.error);
    }
    if (existing.value === null) {
      return R.error(new AppError("resourceNotFound", `${this.modelName} with id ${id} not found`));
    }

    const conflict = await this.repository.getByCpf(input.cpf);
    if (conflict.isError) {
      return R.error(conflict.error);
    }
    if (conflict.value !== null && conflict.value.cpf === input.cpf) {
      return R.error(
        new AppError("resourceConflict", `${this.modelName} with cpf ${input.cpf} already exists`),
      );
    }

    return await this.repository.update(id, input);
  }
}
