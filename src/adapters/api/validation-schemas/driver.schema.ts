import dayjs from "dayjs";
import customParserFormat from "dayjs/plugin/customParseFormat";
import { z } from "zod";
import { CreateUserSchema } from "@/adapters/api/validation-schemas/user.schema";
import { USER_VALIDATION } from "@/domain/utils/constants";

dayjs.extend(customParserFormat);

export const CreateDriverSchema = z.strictObject({
  ...CreateUserSchema.shape,
  dateOfBirth: z
    .string()
    .refine((date) => dayjs(date, "YYYY-MM-DD", true).isValid(), {
      error: USER_VALIDATION.dateOfBirth.messageFormat,
    })
    .refine(
      (date) =>
        dayjs(date).isBefore(dayjs().subtract(USER_VALIDATION.dateOfBirth.minDriverAge, "years")),
      { error: USER_VALIDATION.dateOfBirth.messageDriverAge },
    ),
  vehicle: z
    .string()
    .min(USER_VALIDATION.vehicle.minLength, { error: USER_VALIDATION.vehicle.message })
    .max(USER_VALIDATION.vehicle.maxLength, { error: USER_VALIDATION.vehicle.message }),
});
export type CreateDriverSchema = z.infer<typeof CreateDriverSchema>;
