import type { BaseUser } from "@/domain/shared/base-user.model";

export interface Driver extends BaseUser {
  vehicle: string;
}
