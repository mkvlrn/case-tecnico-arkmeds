import { isValid } from "@fnando/cpf";
import { z } from "zod";

const dobRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

export const CreateUserSchema = z.strictObject({
  name: z.string().min(3).max(80),
  cpf: z.string().refine((cpf) => isValid(cpf)),
  dateOfBirth: z.string().regex(dobRegex),
  gender: z.enum(["male", "female", "other", "undisclosed"]),
  address: z.string().min(10).max(255),
  phone: z.string().min(10).max(255),
});
