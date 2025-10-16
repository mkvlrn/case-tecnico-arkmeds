import type { User } from "@/domain/features/user/user.model";

export interface Passenger extends User {
  prefersNoConversation: boolean;
}
