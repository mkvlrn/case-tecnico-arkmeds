import { strip } from "@fnando/cpf";
import { expect } from "@jest/globals";
import { StatusCodes } from "http-status-codes";
import { phone } from "phone";
import type { CreatePassengerSchema } from "@/adapters/api/validation-schemas/passenger.schema";
import { USER_VALIDATION } from "@/domain/utils/constants";

const validPassengerInput = {
  name: "Test Passenger",
  cpf: "664.764.350-86",
  gender: "female",
  dateOfBirth: "2005-01-01",
  address: "420 Santa Monica Blvd, Los Angeles, CA 90012",
  phone: "(213) 555-1234",
  prefersNoConversation: true,
} satisfies CreatePassengerSchema;

export const createPassenger = {
  success: {
    input: validPassengerInput,
    output: {
      ...validPassengerInput,
      id: expect.any(String),
      cpf: strip(validPassengerInput.cpf),
      phone: phone(validPassengerInput.phone).phoneNumber,
    },
  },

  fail: [
    // ===== cpf conflict validation =====
    {
      spec: "cpf conflict",
      input: validPassengerInput,
      statusCode: StatusCodes.CONFLICT,
      error: {
        code: "resourceConflict",
        message: `passenger with cpf ${strip(validPassengerInput.cpf)} already exists`,
      },
    },

    // ===== name validation =====
    {
      spec: "missing name",
      input: { ...validPassengerInput, name: undefined },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ name: "Invalid input: expected string, received undefined" }],
      },
    },
    {
      spec: "name too short",
      input: { ...validPassengerInput, name: "AB" },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ name: USER_VALIDATION.name.message }],
      },
    },
    {
      spec: "name too long",
      input: { ...validPassengerInput, name: "A".repeat(81) },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ name: USER_VALIDATION.name.message }],
      },
    },
    {
      spec: "name not a string (number)",
      input: { ...validPassengerInput, name: 12_345 },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ name: "Invalid input: expected string, received number" }],
      },
    },
    {
      spec: "name not a string (null)",
      input: { ...validPassengerInput, name: null },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ name: "Invalid input: expected string, received null" }],
      },
    },

    // ===== cpf validation =====
    {
      spec: "missing cpf",
      input: { ...validPassengerInput, cpf: undefined },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ cpf: "Invalid input: expected string, received undefined" }],
      },
    },
    {
      spec: "invalid cpf format",
      input: { ...validPassengerInput, cpf: "123.456.789-00" },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ cpf: USER_VALIDATION.cpf.message }],
      },
    },
    {
      spec: "cpf not a string",
      input: { ...validPassengerInput, cpf: 12_345_678_900 },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ cpf: "Invalid input: expected string, received number" }],
      },
    },

    // ===== dateOfBirth validation =====
    {
      spec: "missing dateOfBirth",
      input: { ...validPassengerInput, dateOfBirth: undefined },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ dateOfBirth: "Invalid input: expected string, received undefined" }],
      },
    },
    {
      spec: "invalid dateOfBirth format",
      input: { ...validPassengerInput, dateOfBirth: "01/01/2005" },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ dateOfBirth: USER_VALIDATION.dateOfBirth.messageFormat }],
      },
    },
    {
      spec: "invalid dateOfBirth month",
      input: { ...validPassengerInput, dateOfBirth: "2005-13-01" },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ dateOfBirth: USER_VALIDATION.dateOfBirth.messageFormat }],
      },
    },
    {
      spec: "invalid dateOfBirth day",
      input: { ...validPassengerInput, dateOfBirth: "2005-01-32" },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ dateOfBirth: USER_VALIDATION.dateOfBirth.messageFormat }],
      },
    },
    {
      spec: "dateOfBirth not a string",
      input: { ...validPassengerInput, dateOfBirth: 20_050_101 },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ dateOfBirth: "Invalid input: expected string, received number" }],
      },
    },
    {
      spec: "passenger is too young",
      input: {
        ...validPassengerInput,
        dateOfBirth: new Date(Date.now() - 14 * 365.25 * 24 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 10),
      },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ dateOfBirth: USER_VALIDATION.dateOfBirth.messagePassengerAge }],
      },
    },

    // ===== gender validation =====
    {
      spec: "missing gender",
      input: { ...validPassengerInput, gender: undefined },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ gender: USER_VALIDATION.gender.message }],
      },
    },
    {
      spec: "invalid gender value",
      input: { ...validPassengerInput, gender: "unknown" },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ gender: USER_VALIDATION.gender.message }],
      },
    },
    {
      spec: "gender not a string",
      input: { ...validPassengerInput, gender: 123 },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ gender: USER_VALIDATION.gender.message }],
      },
    },

    // ===== address validation =====
    {
      spec: "missing address",
      input: { ...validPassengerInput, address: undefined },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ address: "Invalid input: expected string, received undefined" }],
      },
    },
    {
      spec: "address too short",
      input: { ...validPassengerInput, address: "Short" },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ address: USER_VALIDATION.address.message }],
      },
    },
    {
      spec: "address too long",
      input: { ...validPassengerInput, address: "A".repeat(256) },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ address: USER_VALIDATION.address.message }],
      },
    },
    {
      spec: "address not a string",
      input: { ...validPassengerInput, address: 12_345 },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ address: "Invalid input: expected string, received number" }],
      },
    },

    // ===== phone validation =====
    {
      spec: "missing phone",
      input: { ...validPassengerInput, phone: undefined },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ phone: "Invalid input: expected string, received undefined" }],
      },
    },
    {
      spec: "invalid phone format",
      input: { ...validPassengerInput, phone: "123456789" },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ phone: USER_VALIDATION.phone.message }],
      },
    },
    {
      spec: "phone not a string",
      input: { ...validPassengerInput, phone: 1_234_567_890 },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ phone: "Invalid input: expected string, received number" }],
      },
    },

    // ===== prefersNoConversation validation =====
    {
      spec: "missing prefersNoConversation",
      input: { ...validPassengerInput, prefersNoConversation: undefined },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ prefersNoConversation: USER_VALIDATION.prefersNoConversation.message }],
      },
    },
    {
      spec: "prefersNoConversation not a boolean (string)",
      input: { ...validPassengerInput, prefersNoConversation: "true" },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ prefersNoConversation: USER_VALIDATION.prefersNoConversation.message }],
      },
    },
    {
      spec: "prefersNoConversation not a boolean (number)",
      input: { ...validPassengerInput, prefersNoConversation: 1 },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ prefersNoConversation: USER_VALIDATION.prefersNoConversation.message }],
      },
    },

    // ===== strictObject validation =====
    {
      spec: "extra field (strictObject)",
      input: { ...validPassengerInput, extraField: "not allowed" },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ "": "Unrecognized key: 'extraField'" }],
      },
    },
    {
      spec: "empty object",
      input: {},
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: expect.arrayContaining([
          { name: expect.any(String) },
          { cpf: expect.any(String) },
          { dateOfBirth: expect.any(String) },
          { gender: expect.any(String) },
          { address: expect.any(String) },
          { phone: expect.any(String) },
          { prefersNoConversation: expect.any(String) },
        ]),
      },
    },
  ],
};
