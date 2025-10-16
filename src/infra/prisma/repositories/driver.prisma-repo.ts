import type { CreateDriverSchema } from "@/adapters/api/validation-schemas/driver.schema";
import type { Driver } from "@/domain/features/driver/driver.model";
import type { DriverRepository } from "@/domain/shared/base-user.repository";
import { BaseUserPrismaRepo } from "./base-user.prisma-repo";

export class DriverPrismaRepo
  extends BaseUserPrismaRepo<Driver, CreateDriverSchema>
  implements DriverRepository
{
  protected readonly modelName = "driver" as const;
}
