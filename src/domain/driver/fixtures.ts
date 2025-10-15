import type { CreateDriverSchema } from "@/adapters/api/driver/create-driver.schema";
import type { Driver } from "@/domain/driver/driver.entity";

export const validDriverInput = {
  name: "Test Driver",
  cpf: "12345678900",
  age: 42,
  gender: "female",
  address: "Hollywood Drive 42, Los Angeles, CA",
  phone: "(123) 456-7890",
  vehicle: "",
} satisfies CreateDriverSchema;

export const validDriverOutput = {
  id: "test-id",
  ...validDriverInput,
} satisfies Driver;
