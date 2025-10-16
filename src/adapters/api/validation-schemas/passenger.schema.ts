import dayjs from "dayjs";
import customParserFormat from "dayjs/plugin/customParseFormat";
import { z } from "zod";
import { CreateUserSchema } from "@/adapters/api/validation-schemas/user.schema";
import { USER_VALIDATION } from "@/domain/utils/constants";

dayjs.extend(customParserFormat);

export const CreatePassengerSchema = z.strictObject({
  ...CreateUserSchema.shape,
  dateOfBirth: z
    .string()
    .refine((date) => dayjs(date, "YYYY-MM-DD", true).isValid(), {
      error: USER_VALIDATION.dateOfBirth.messageFormat,
    })
    .refine(
      (date) =>
        dayjs(date).isBefore(
          dayjs().subtract(USER_VALIDATION.dateOfBirth.minPassengerAge, "years"),
        ),
      { error: USER_VALIDATION.dateOfBirth.messagePassengerAge },
    ),
  prefersNoConversation: z.boolean({ error: USER_VALIDATION.prefersNoConversation.message }),
});
export type CreatePassengerSchema = z.infer<typeof CreatePassengerSchema>;
