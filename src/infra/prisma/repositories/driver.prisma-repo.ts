import type { CreateDriverSchema } from "@/adapters/api/user/create-user.schema";
import type { Driver } from "@/domain/user/driver.entity";
import type { UserRepository } from "@/domain/user/user.repository";
import { AppError } from "@/domain/utils/app-error";
import { USERS_PER_PAGE } from "@/domain/utils/constants";
import { type AsyncResult, R } from "@/domain/utils/result";
import type { PrismaClient } from "@/generated/prisma/client";

export class DriverPrismaRepo implements UserRepository<Driver, CreateDriverSchema> {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(input: CreateDriverSchema): AsyncResult<Driver, AppError> {
    try {
      const driver = await this.prisma.driver.create({ data: input });
      return R.ok(driver);
    } catch (error) {
      return this.returnError(error);
    }
  }

  async getAll(page: number): AsyncResult<Driver[], AppError> {
    try {
      const drivers = await this.prisma.driver.findMany({
        skip: (page - 1) * USERS_PER_PAGE,
        take: USERS_PER_PAGE,
      });
      return R.ok(drivers);
    } catch (error) {
      return this.returnError(error);
    }
  }

  async getById(id: string): AsyncResult<Driver | null, AppError> {
    try {
      const driver = await this.prisma.driver.findUnique({
        where: { id },
      });
      return R.ok(driver);
    } catch (error) {
      return this.returnError(error);
    }
  }

  async update(id: string, input: CreateDriverSchema): AsyncResult<Driver, AppError> {
    try {
      const driver = await this.prisma.driver.update({
        where: { id },
        data: input,
      });
      return R.ok(driver);
    } catch (error) {
      return this.returnError(error);
    }
  }

  async delete(id: string): AsyncResult<true, AppError> {
    try {
      await this.prisma.driver.delete({
        where: { id },
      });
      return R.ok(true);
    } catch (error) {
      return this.returnError(error);
    }
  }

  async count(): AsyncResult<number, AppError> {
    try {
      const count = await this.prisma.driver.count();
      return R.ok(count);
    } catch (error) {
      return this.returnError(error);
    }
  }

  private returnError(error: unknown) {
    const msg = (error as Error).message;
    return R.error(new AppError("databaseError", msg, error));
  }
}
