import type { User } from "@/domain/user/user.entity";

export interface Driver extends User {
  vehicle: string;
}
