import type { CreateDriverSchema } from "@/adapters/api/validation-schemas/driver.schema";
import type { Driver } from "@/domain/features/driver/driver.model";
import type { DriverRepository } from "@/domain/shared/base-user.repository";
import { AppError } from "@/domain/utils/app-error";
import { type AsyncResult, R } from "@/domain/utils/result";
import { type Driver as DriverTable, Prisma } from "@/generated/prisma/client";
import { BaseUserPrismaRepo } from "./base-user.prisma-repo";

export class DriverPrismaRepo
  extends BaseUserPrismaRepo<Driver, CreateDriverSchema>
  implements DriverRepository
{
  protected readonly modelName = "driver" as const;

  async getNearest(): AsyncResult<Driver | null, AppError> {
    const query = Prisma.sql`SELECT * FROM "drivers" ORDER BY RANDOM() LIMIT 1`;
    try {
      const result = await this.prisma.$queryRaw<DriverTable[]>(query);
      const [driver] = result;
      if (!driver) {
        return R.ok(null);
      }

      return R.ok(this.transformDate(driver) as unknown as Driver);
    } catch (err) {
      const msg = (err as Error).message;
      return R.error(new AppError("databaseError", msg, err));
    }
  }
}
