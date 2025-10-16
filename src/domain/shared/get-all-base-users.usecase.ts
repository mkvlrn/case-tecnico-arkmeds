import type { BaseUser } from "@/domain/shared/base-user.model";
import type { BaseUserRepository } from "@/domain/shared/base-user.repository";
import type { AppError } from "@/domain/utils/app-error";
import { PaginationResult } from "@/domain/utils/pagination-result";
import { type AsyncResult, R } from "@/domain/utils/result";

export abstract class GetAllBaseUserUseCase<
  TModel extends BaseUser,
  TRepository extends BaseUserRepository<TModel>,
> {
  protected readonly repository: TRepository;

  constructor(repository: TRepository) {
    this.repository = repository;
  }

  async execute(page = 1): AsyncResult<PaginationResult<TModel>, AppError> {
    const total = await this.repository.count();
    if (total.isError) {
      return R.error(total.error);
    }

    const entities = await this.repository.getAll(page);
    if (entities.isError) {
      return R.error(entities.error);
    }

    return R.ok(new PaginationResult(total.value, page, entities.value));
  }
}
