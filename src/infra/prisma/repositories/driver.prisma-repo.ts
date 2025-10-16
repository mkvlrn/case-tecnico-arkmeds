import type { CreateDriverSchema } from "@/adapters/api/validation-schemas/driver.schema";
import type { Driver } from "@/domain/features/driver/driver.model";
import type { DriverRepository } from "@/domain/features/driver/driver.repository";

import { AppError } from "@/domain/utils/app-error";
import { USERS_PER_PAGE } from "@/domain/utils/constants";
import { type AsyncResult, R } from "@/domain/utils/result";
import type { PrismaClient } from "@/generated/prisma/client";

export class DriverPrismaRepo implements DriverRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(input: CreateDriverSchema): AsyncResult<Driver, AppError> {
    try {
      const driver = await this.prisma.driver.create({
        data: { ...input, dateOfBirth: new Date(input.dateOfBirth) },
      });
      return R.ok({ ...driver, dateOfBirth: driver.dateOfBirth.toISOString().slice(0, 10) });
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
      return R.ok(
        drivers.map((driver) => ({
          ...driver,
          dateOfBirth: driver.dateOfBirth.toISOString().slice(0, 10),
        })),
      );
    } catch (error) {
      return this.returnError(error);
    }
  }

  async getById(id: string): AsyncResult<Driver | null, AppError> {
    try {
      const driver = await this.prisma.driver.findUnique({
        where: { id },
      });
      return R.ok(
        driver !== null
          ? { ...driver, dateOfBirth: driver.dateOfBirth.toISOString().slice(0, 10) }
          : null,
      );
    } catch (error) {
      return this.returnError(error);
    }
  }

  async getByCpf(cpf: string): AsyncResult<Driver | null, AppError> {
    try {
      const driver = await this.prisma.driver.findUnique({
        where: { cpf },
      });
      return R.ok(
        driver !== null
          ? { ...driver, dateOfBirth: driver.dateOfBirth.toISOString().slice(0, 10) }
          : null,
      );
    } catch (error) {
      return this.returnError(error);
    }
  }

  async update(id: string, input: CreateDriverSchema): AsyncResult<Driver, AppError> {
    try {
      const driver = await this.prisma.driver.update({
        where: { id },
        data: { ...input, dateOfBirth: new Date(input.dateOfBirth) },
      });
      return R.ok({ ...driver, dateOfBirth: driver.dateOfBirth.toISOString().slice(0, 10) });
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
