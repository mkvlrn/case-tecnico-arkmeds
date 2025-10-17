import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { z } from "zod";
import { USER_VALIDATION } from "@/domain/utils/constants";

dayjs.extend(customParseFormat);

export function createDateOfBirthValidation(minAge: number, errorMessage: string) {
  return z
    .string()
    .refine((date) => dayjs(date, "YYYY-MM-DD", true).isValid(), {
      error: USER_VALIDATION.dateOfBirth.messageFormat,
    })
    .refine((date) => dayjs(date).isBefore(dayjs().subtract(minAge, "years")), {
      error: errorMessage,
    });
}
