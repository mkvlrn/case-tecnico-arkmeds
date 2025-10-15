import { isValid } from "@fnando/cpf";
import { z } from "zod";

export const CreateDriverSchema = z.object({
  name: z.string().min(3).max(80),
  cpf: z.string().refine((cpf) => isValid(cpf)),
  age: z.number().min(18).max(100),
  gender: z.enum(["male", "female", "other", "undisclosed"]),
  address: z.string().min(10).max(255),
  phone: z.string().min(10).max(255),
  vehicle: z.string().min(10).max(255),
});

export type CreateDriverSchema = z.infer<typeof CreateDriverSchema>;
