import { strip } from "@fnando/cpf";
import { expect } from "@jest/globals";
import { StatusCodes } from "http-status-codes";
import { phone } from "phone";
import type { CreatePassengerSchema } from "@/adapters/api/validation-schemas/passenger.schema";
import { USER_VALIDATION } from "@/domain/utils/constants";

const validUpdateInput = {
  name: "Updated Passenger Name",
  cpf: "517.372.940-60",
  gender: "male",
  dateOfBirth: "2005-05-15",
  address: "123 Updated St, New City, ST 12345",
  phone: "(213) 123-4567",
  prefersNoConversation: false,
} satisfies CreatePassengerSchema;

export const updatePassenger = {
  success: {
    id: "okmclejrj1xegofrbc164ie0",
    input: validUpdateInput,
    output: {
      ...validUpdateInput,
      id: "okmclejrj1xegofrbc164ie0",
      cpf: strip(validUpdateInput.cpf),
      phone: phone(validUpdateInput.phone).phoneNumber,
    },
  },

  fail: [
    {
      spec: "passenger not found",
      id: "very-wrong-id",
      input: validUpdateInput,
      statusCode: StatusCodes.NOT_FOUND,
      error: {
        code: "resourceNotFound",
        message: "passenger with id very-wrong-id not found",
      },
    },
    {
      spec: "cpf conflict",
      id: "okmclejrj1xegofrbc164ie0",
      input: { ...validUpdateInput, cpf: "729.359.300-70" },
      statusCode: StatusCodes.CONFLICT,
      error: {
        code: "resourceConflict",
        message: `passenger with cpf ${strip("729.359.300-70")} already exists`,
      },
    },

    {
      spec: "missing name",
      id: "okmclejrj1xegofrbc164ie0",
      input: { ...validUpdateInput, name: undefined },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ name: "Invalid input: expected string, received undefined" }],
      },
    },
    {
      spec: "name too short",
      id: "okmclejrj1xegofrbc164ie0",
      input: { ...validUpdateInput, name: "AB" },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ name: USER_VALIDATION.name.message }],
      },
    },
    {
      spec: "name too long",
      id: "okmclejrj1xegofrbc164ie0",
      input: { ...validUpdateInput, name: "A".repeat(81) },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ name: USER_VALIDATION.name.message }],
      },
    },
    {
      spec: "name not a string (number)",
      id: "okmclejrj1xegofrbc164ie0",
      input: { ...validUpdateInput, name: 12_345 },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ name: "Invalid input: expected string, received number" }],
      },
    },
    {
      spec: "name not a string (null)",
      id: "okmclejrj1xegofrbc164ie0",
      input: { ...validUpdateInput, name: null },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ name: "Invalid input: expected string, received null" }],
      },
    },

    {
      spec: "missing cpf",
      id: "okmclejrj1xegofrbc164ie0",
      input: { ...validUpdateInput, cpf: undefined },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ cpf: "Invalid input: expected string, received undefined" }],
      },
    },
    {
      spec: "invalid cpf format",
      id: "okmclejrj1xegofrbc164ie0",
      input: { ...validUpdateInput, cpf: "123.456.789-00" },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ cpf: USER_VALIDATION.cpf.message }],
      },
    },
    {
      spec: "cpf not a string",
      id: "okmclejrj1xegofrbc164ie0",
      input: { ...validUpdateInput, cpf: 12_345_678_900 },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ cpf: "Invalid input: expected string, received number" }],
      },
    },

    {
      spec: "missing dateOfBirth",
      id: "okmclejrj1xegofrbc164ie0",
      input: { ...validUpdateInput, dateOfBirth: undefined },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ dateOfBirth: "Invalid input: expected string, received undefined" }],
      },
    },
    {
      spec: "invalid dateOfBirth format",
      id: "okmclejrj1xegofrbc164ie0",
      input: { ...validUpdateInput, dateOfBirth: "01/01/2005" },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ dateOfBirth: USER_VALIDATION.dateOfBirth.messageFormat }],
      },
    },
    {
      spec: "invalid dateOfBirth month",
      id: "okmclejrj1xegofrbc164ie0",
      input: { ...validUpdateInput, dateOfBirth: "2005-13-01" },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ dateOfBirth: USER_VALIDATION.dateOfBirth.messageFormat }],
      },
    },
    {
      spec: "invalid dateOfBirth day",
      id: "okmclejrj1xegofrbc164ie0",
      input: { ...validUpdateInput, dateOfBirth: "2005-01-32" },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ dateOfBirth: USER_VALIDATION.dateOfBirth.messageFormat }],
      },
    },
    {
      spec: "dateOfBirth not a string",
      id: "okmclejrj1xegofrbc164ie0",
      input: { ...validUpdateInput, dateOfBirth: 20_050_101 },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ dateOfBirth: "Invalid input: expected string, received number" }],
      },
    },
    {
      spec: "passenger is too young",
      id: "okmclejrj1xegofrbc164ie0",
      input: {
        ...validUpdateInput,
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

    {
      spec: "missing gender",
      id: "okmclejrj1xegofrbc164ie0",
      input: { ...validUpdateInput, gender: undefined },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ gender: USER_VALIDATION.gender.message }],
      },
    },
    {
      spec: "invalid gender value",
      id: "okmclejrj1xegofrbc164ie0",
      input: { ...validUpdateInput, gender: "unknown" },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ gender: USER_VALIDATION.gender.message }],
      },
    },
    {
      spec: "gender not a string",
      id: "okmclejrj1xegofrbc164ie0",
      input: { ...validUpdateInput, gender: 123 },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ gender: USER_VALIDATION.gender.message }],
      },
    },

    {
      spec: "missing address",
      id: "okmclejrj1xegofrbc164ie0",
      input: { ...validUpdateInput, address: undefined },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ address: "Invalid input: expected string, received undefined" }],
      },
    },
    {
      spec: "address too short",
      id: "okmclejrj1xegofrbc164ie0",
      input: { ...validUpdateInput, address: "Short" },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ address: USER_VALIDATION.address.message }],
      },
    },
    {
      spec: "address too long",
      id: "okmclejrj1xegofrbc164ie0",
      input: { ...validUpdateInput, address: "A".repeat(256) },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ address: USER_VALIDATION.address.message }],
      },
    },
    {
      spec: "address not a string",
      id: "okmclejrj1xegofrbc164ie0",
      input: { ...validUpdateInput, address: 12_345 },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ address: "Invalid input: expected string, received number" }],
      },
    },

    {
      spec: "missing phone",
      id: "okmclejrj1xegofrbc164ie0",
      input: { ...validUpdateInput, phone: undefined },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ phone: "Invalid input: expected string, received undefined" }],
      },
    },
    {
      spec: "invalid phone format",
      id: "okmclejrj1xegofrbc164ie0",
      input: { ...validUpdateInput, phone: "123456789" },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ phone: USER_VALIDATION.phone.message }],
      },
    },
    {
      spec: "phone not a string",
      id: "okmclejrj1xegofrbc164ie0",
      input: { ...validUpdateInput, phone: 1_234_567_890 },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ phone: "Invalid input: expected string, received number" }],
      },
    },

    {
      spec: "missing prefersNoConversation",
      id: "okmclejrj1xegofrbc164ie0",
      input: { ...validUpdateInput, prefersNoConversation: undefined },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ prefersNoConversation: USER_VALIDATION.prefersNoConversation.message }],
      },
    },
    {
      spec: "prefersNoConversation not a boolean (string)",
      id: "okmclejrj1xegofrbc164ie0",
      input: { ...validUpdateInput, prefersNoConversation: "false" },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ prefersNoConversation: USER_VALIDATION.prefersNoConversation.message }],
      },
    },
    {
      spec: "prefersNoConversation not a boolean (number)",
      id: "okmclejrj1xegofrbc164ie0",
      input: { ...validUpdateInput, prefersNoConversation: 0 },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ prefersNoConversation: USER_VALIDATION.prefersNoConversation.message }],
      },
    },

    {
      spec: "extra field (strictObject)",
      id: "okmclejrj1xegofrbc164ie0",
      input: { ...validUpdateInput, extraField: "not allowed" },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ "": "Unrecognized key: 'extraField'" }],
      },
    },
    {
      spec: "empty object",
      id: "okmclejrj1xegofrbc164ie0",
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
