import { z } from "zod";
import { CreateUserSchema } from "@/adapters/api/validation-schemas/user.schema";

export const CreatePassengerSchema = z.strictObject({
  ...CreateUserSchema.shape,
  prefersNoConversation: z.boolean(),
});
export type CreatePassengerSchema = z.infer<typeof CreatePassengerSchema>;
