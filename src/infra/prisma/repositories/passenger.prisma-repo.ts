import type { CreatePassengerSchema } from "@/adapters/api/validation-schemas/passenger.schema";
import type { Passenger } from "@/domain/features/passenger/passenger.model";
import type { PassengerRepository } from "@/domain/features/passenger/passenger.repository";
import { AppError } from "@/domain/utils/app-error";
import { USERS_PER_PAGE } from "@/domain/utils/constants";
import { type AsyncResult, R } from "@/domain/utils/result";
import type { PrismaClient } from "@/generated/prisma/client";

export class PassengerPrismaRepo implements PassengerRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(input: CreatePassengerSchema): AsyncResult<Passenger, AppError> {
    try {
      const passenger = await this.prisma.passenger.create({ data: input });
      return R.ok({ ...passenger, dateOfBirth: passenger.dateOfBirth.toISOString().slice(0, 10) });
    } catch (error) {
      return this.returnError(error);
    }
  }

  async getAll(page: number): AsyncResult<Passenger[], AppError> {
    try {
      const passengers = await this.prisma.passenger.findMany({
        skip: (page - 1) * USERS_PER_PAGE,
        take: USERS_PER_PAGE,
      });
      return R.ok(
        passengers.map((passenger) => ({
          ...passenger,
          dateOfBirth: passenger.dateOfBirth.toISOString().slice(0, 10),
        })),
      );
    } catch (error) {
      return this.returnError(error);
    }
  }

  async getById(id: string): AsyncResult<Passenger | null, AppError> {
    try {
      const passenger = await this.prisma.passenger.findUnique({
        where: { id },
      });
      return R.ok(
        passenger !== null
          ? { ...passenger, dateOfBirth: passenger.dateOfBirth.toISOString().slice(0, 10) }
          : null,
      );
    } catch (error) {
      return this.returnError(error);
    }
  }

  async getByCpf(cpf: string): AsyncResult<Passenger | null, AppError> {
    try {
      const passenger = await this.prisma.passenger.findUnique({
        where: { cpf },
      });
      return R.ok(
        passenger !== null
          ? { ...passenger, dateOfBirth: passenger.dateOfBirth.toISOString().slice(0, 10) }
          : null,
      );
    } catch (error) {
      return this.returnError(error);
    }
  }

  async update(id: string, input: CreatePassengerSchema): AsyncResult<Passenger, AppError> {
    try {
      const passenger = await this.prisma.passenger.update({
        where: { id },
        data: input,
      });
      return R.ok({ ...passenger, dateOfBirth: passenger.dateOfBirth.toISOString().slice(0, 10) });
    } catch (error) {
      return this.returnError(error);
    }
  }

  async delete(id: string): AsyncResult<true, AppError> {
    try {
      await this.prisma.passenger.delete({
        where: { id },
      });
      return R.ok(true);
    } catch (error) {
      return this.returnError(error);
    }
  }

  async count(): AsyncResult<number, AppError> {
    try {
      const count = await this.prisma.passenger.count();
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
