import type { User } from "@/domain/misc/user.entity";

export interface Driver extends User {
  vehicle: string;
}
