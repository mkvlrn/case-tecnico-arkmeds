import type { User } from "@/domain/features/user/user.model";

export interface Driver extends User {
  vehicle: string;
}
