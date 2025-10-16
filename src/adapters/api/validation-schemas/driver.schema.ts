import { z } from "zod";
import { CreateUserSchema } from "@/adapters/api/validation-schemas/user.schema";

export const CreateDriverSchema = z.strictObject({
  ...CreateUserSchema.shape,
  vehicle: z.string().min(10).max(255),
});
export type CreateDriverSchema = z.infer<typeof CreateDriverSchema>;
