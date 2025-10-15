import type {
  CreateDriverSchema,
  CreatePassengerSchema,
} from "@/adapters/api/user/create-user.schema";
import type { Driver } from "@/domain/user/driver.entity";
import type { Passenger } from "@/domain/user/passenger.entity";

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
