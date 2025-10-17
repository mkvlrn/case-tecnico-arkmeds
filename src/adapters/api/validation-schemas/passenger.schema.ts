import { z } from "zod";
import { createDateOfBirthValidation } from "@/adapters/api/validation-schemas/helpers/date-validation";
import { CreateUserSchema } from "@/adapters/api/validation-schemas/user.schema";
import { USER_VALIDATION } from "@/domain/utils/constants";

export const CreatePassengerSchema = z.strictObject({
  ...CreateUserSchema.shape,
  dateOfBirth: createDateOfBirthValidation(
    USER_VALIDATION.dateOfBirth.minPassengerAge,
    USER_VALIDATION.dateOfBirth.messagePassengerAge,
  ),
  prefersNoConversation: z.boolean({ error: USER_VALIDATION.prefersNoConversation.message }),
});
export type CreatePassengerSchema = z.infer<typeof CreatePassengerSchema>;
