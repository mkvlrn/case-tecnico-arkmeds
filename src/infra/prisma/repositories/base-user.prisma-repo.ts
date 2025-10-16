import type { CreateUserSchema } from "@/adapters/api/validation-schemas/user.schema";
import type { BaseUserRepository } from "@/domain/shared/base-user.repository";
import { AppError } from "@/domain/utils/app-error";
import { USERS_PER_PAGE } from "@/domain/utils/constants";
import { type AsyncResult, R } from "@/domain/utils/result";
import type { Prisma, PrismaClient } from "@/generated/prisma/client";

type FullCreateUserSchema = CreateUserSchema & { dateOfBirth: string };

export abstract class BaseUserPrismaRepo<TModel, TCreateSchema extends FullCreateUserSchema>
  implements BaseUserRepository<TModel, TCreateSchema>
{
  protected readonly prisma: PrismaClient;
  protected abstract readonly modelName: Uncapitalize<Prisma.ModelName>;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  protected get model() {
    return this.prisma[this.modelName];
  }

  async create(input: TCreateSchema): AsyncResult<TModel, AppError> {
    try {
      // @ts-expect-error https://github.com/prisma/prisma/discussions/4384
      const entity = await this.model.create({
        data: { ...input, dateOfBirth: new Date(input.dateOfBirth) },
      });
      return R.ok(this.transformDate(entity));
    } catch (error) {
      return this.returnError(error);
    }
  }

  async getAll(page: number): AsyncResult<TModel[], AppError> {
    try {
      // @ts-expect-error https://github.com/prisma/prisma/discussions/4384
      const entities = await this.model.findMany({
        skip: (page - 1) * USERS_PER_PAGE,
        take: USERS_PER_PAGE,
      });
      return R.ok(
        entities.map((entity: object & { dateOfBirth: Date }) => this.transformDate(entity)),
      );
    } catch (error) {
      return this.returnError(error);
    }
  }

  async getById(id: string): AsyncResult<TModel | null, AppError> {
    try {
      // @ts-expect-error https://github.com/prisma/prisma/discussions/4384
      const entity = await this.model.findUnique({
        where: { id },
      });
      return R.ok(entity !== null ? this.transformDate(entity) : null);
    } catch (error) {
      return this.returnError(error);
    }
  }

  async getByCpf(cpf: string): AsyncResult<TModel | null, AppError> {
    try {
      // @ts-expect-error https://github.com/prisma/prisma/discussions/4384
      const entity = await this.model.findUnique({
        where: { cpf },
      });
      return R.ok(entity !== null ? this.transformDate(entity) : null);
    } catch (error) {
      return this.returnError(error);
    }
  }

  async update(id: string, input: TCreateSchema): AsyncResult<TModel, AppError> {
    try {
      // @ts-expect-error https://github.com/prisma/prisma/discussions/4384
      const entity = await this.model.update({
        where: { id },
        data: { ...input, dateOfBirth: new Date(input.dateOfBirth) },
      });
      return R.ok(this.transformDate(entity));
    } catch (error) {
      return this.returnError(error);
    }
  }

  async delete(id: string): AsyncResult<true, AppError> {
    try {
      // @ts-expect-error https://github.com/prisma/prisma/discussions/4384
      await this.model.delete({
        where: { id },
      });
      return R.ok(true);
    } catch (error) {
      return this.returnError(error);
    }
  }

  async count(): AsyncResult<number, AppError> {
    try {
      // @ts-expect-error https://github.com/prisma/prisma/discussions/4384
      const count = await this.model.count();
      return R.ok(count);
    } catch (error) {
      return this.returnError(error);
    }
  }

  protected transformDate(model: object & { dateOfBirth: Date }): TModel {
    return {
      ...model,
      dateOfBirth: model.dateOfBirth.toISOString().slice(0, 10),
    } as TModel;
  }

  protected returnError(error: unknown) {
    const msg = (error as Error).message;
    return R.error(new AppError("databaseError", msg, error));
  }
}
