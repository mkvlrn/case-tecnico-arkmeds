import { z } from "zod";
import { createDateOfBirthValidation } from "@/adapters/api/validation-schemas/helpers/date-validation";
import { CreateUserSchema } from "@/adapters/api/validation-schemas/user.schema";
import { USER_VALIDATION } from "@/domain/utils/constants";

export const CreateDriverSchema = z.strictObject({
  ...CreateUserSchema.shape,
  dateOfBirth: createDateOfBirthValidation(
    USER_VALIDATION.dateOfBirth.minDriverAge,
    USER_VALIDATION.dateOfBirth.messageDriverAge,
  ),
  vehicle: z
    .string()
    .min(USER_VALIDATION.vehicle.minLength, { error: USER_VALIDATION.vehicle.message })
    .max(USER_VALIDATION.vehicle.maxLength, { error: USER_VALIDATION.vehicle.message }),
});
export type CreateDriverSchema = z.infer<typeof CreateDriverSchema>;
