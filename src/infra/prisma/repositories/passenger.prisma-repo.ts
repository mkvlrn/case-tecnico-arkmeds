import type { CreatePassengerSchema } from "@/adapters/api/validation-schemas/passenger.schema";
import type { Passenger } from "@/domain/features/passenger/passenger.model";
import type { PassengerRepository } from "@/domain/shared/base-user.repository";
import { BaseUserPrismaRepo } from "./base-user.prisma-repo";

export class PassengerPrismaRepo
  extends BaseUserPrismaRepo<Passenger, CreatePassengerSchema>
  implements PassengerRepository
{
  protected readonly modelName = "passenger" as const;
}
