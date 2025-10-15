import type { User } from "@/domain/user/user.entity";

export interface Passenger extends User {
  prefersNoConversation: boolean;
}
