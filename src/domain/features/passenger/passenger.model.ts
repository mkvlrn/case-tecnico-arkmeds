import type { BaseUser } from "@/domain/shared/base-user.model";

export interface Passenger extends BaseUser {
  prefersNoConversation: boolean;
}
