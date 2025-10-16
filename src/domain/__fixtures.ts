import type { CreateDriverSchema } from "@/adapters/api/validation-schemas/driver.schema";
import type { CreatePassengerSchema } from "@/adapters/api/validation-schemas/passenger.schema";
import type { Driver } from "@/domain/features/driver/driver.model";
import type { Passenger } from "@/domain/features/passenger/passenger.model";

export const validDriverInput = {
  name: "Test Driver",
  cpf: "12345678901",
  phone: "1234567890",
  age: 42,
  gender: "female",
  address: "Test Address",
  vehicle: "Test Vehicle",
} satisfies CreateDriverSchema;

export const validDriverOutput = {
  id: "test-id",
  ...validDriverInput,
} satisfies Driver;

export const validPassengerInput = {
  name: "Test Driver",
  cpf: "12345678901",
  phone: "1234567890",
  age: 42,
  gender: "female",
  address: "Test Address",
  prefersNoConversation: true,
} satisfies CreatePassengerSchema;

export const validPassengerOutput = {
  id: "test-id",
  ...validPassengerInput,
} satisfies Passenger;
