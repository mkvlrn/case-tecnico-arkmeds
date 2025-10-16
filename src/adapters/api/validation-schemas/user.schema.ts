import { isValid, strip } from "@fnando/cpf";
import { phone as phoneValidation } from "phone";
import { z } from "zod";
import { USER_VALIDATION } from "@/domain/utils/constants";

export const CreateUserSchema = z.strictObject({
  name: z
    .string()
    .min(USER_VALIDATION.name.minLength, { error: USER_VALIDATION.name.message })
    .max(USER_VALIDATION.name.maxLength, { error: USER_VALIDATION.name.message }),
  cpf: z
    .string()
    .refine((cpf) => isValid(cpf), { error: USER_VALIDATION.cpf.message })
    .transform((cpf) => strip(cpf)),
  gender: z.enum(["male", "female", "other", "undisclosed"], {
    error: USER_VALIDATION.gender.message,
  }),
  address: z
    .string()
    .min(USER_VALIDATION.address.minLength, { error: USER_VALIDATION.address.message })
    .max(USER_VALIDATION.address.maxLength, { error: USER_VALIDATION.address.message }),
  phone: z
    .string()
    .refine((phone) => phoneValidation(phone).isValid, { error: USER_VALIDATION.phone.message })
    // biome-ignore lint/style/noNonNullAssertion: it's guaranteed to be a string if validated
    .transform((phone) => phoneValidation(phone).phoneNumber!),
});
