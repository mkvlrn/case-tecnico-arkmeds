import { expect } from "@jest/globals";
import { StatusCodes } from "http-status-codes";
import type { CreateDriverSchema } from "@/adapters/api/validation-schemas/driver.schema";

const validDriverInput = {
  name: "Test Driver",
  cpf: "664.764.350-86",
  gender: "female",
  dateOfBirth: "1999-01-01",
  address: "420 Santa Monica Blvd, Los Angeles, CA 90012",
  phone: "(213) 555-1234",
  vehicle: "2021 Toyota Corolla, Black",
} satisfies CreateDriverSchema;

export const createDriver = {
  success: {
    input: validDriverInput,
    output: { ...validDriverInput, id: expect.any(String) },
  },

  fail: [
    {
      spec: "cpf conflict",
      input: validDriverInput,
      statusCode: StatusCodes.CONFLICT,
      error: {
        code: "resourceConflict",
        message: `driver with cpf ${validDriverInput.cpf} already exists`,
      },
    },

    {
      spec: "missing name",
      input: { ...validDriverInput, name: undefined },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ name: "Invalid input: expected string, received undefined" }],
      },
    },
    {
      spec: "name too short",
      input: { ...validDriverInput, name: "AB" },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ name: "Too small: expected string to have >=3 characters" }],
      },
    },
    {
      spec: "name too long",
      input: { ...validDriverInput, name: "A".repeat(81) },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ name: "Too big: expected string to have <=80 characters" }],
      },
    },
    {
      spec: "name not a string (number)",
      input: { ...validDriverInput, name: 12_345 },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ name: "Invalid input: expected string, received number" }],
      },
    },
    {
      spec: "name not a string (null)",
      input: { ...validDriverInput, name: null },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ name: "Invalid input: expected string, received null" }],
      },
    },

    {
      spec: "missing cpf",
      input: { ...validDriverInput, cpf: undefined },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ cpf: "Invalid input: expected string, received undefined" }],
      },
    },
    {
      spec: "invalid cpf format",
      input: { ...validDriverInput, cpf: "123.456.789-00" },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ cpf: "Invalid input" }],
      },
    },
    {
      spec: "cpf not a string",
      input: { ...validDriverInput, cpf: 12_345_678_900 },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ cpf: "Invalid input: expected string, received number" }],
      },
    },

    {
      spec: "missing dateOfBirth",
      input: { ...validDriverInput, dateOfBirth: undefined },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ dateOfBirth: "Invalid input: expected string, received undefined" }],
      },
    },
    {
      spec: "invalid dateOfBirth format",
      input: { ...validDriverInput, dateOfBirth: "01/01/1999" },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [
          {
            dateOfBirth:
              "Invalid string: must match pattern /^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$/",
          },
        ],
      },
    },
    {
      spec: "invalid dateOfBirth month",
      input: { ...validDriverInput, dateOfBirth: "1999-13-01" },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [
          {
            dateOfBirth:
              "Invalid string: must match pattern /^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$/",
          },
        ],
      },
    },
    {
      spec: "invalid dateOfBirth day",
      input: { ...validDriverInput, dateOfBirth: "1999-01-32" },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [
          {
            dateOfBirth:
              "Invalid string: must match pattern /^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$/",
          },
        ],
      },
    },
    {
      spec: "dateOfBirth not a string",
      input: { ...validDriverInput, dateOfBirth: 19_990_101 },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ dateOfBirth: "Invalid input: expected string, received number" }],
      },
    },

    {
      spec: "missing gender",
      input: { ...validDriverInput, gender: undefined },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [
          {
            gender: "Invalid option: expected one of 'male'|'female'|'other'|'undisclosed'",
          },
        ],
      },
    },
    {
      spec: "invalid gender value",
      input: { ...validDriverInput, gender: "unknown" },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [
          { gender: "Invalid option: expected one of 'male'|'female'|'other'|'undisclosed'" },
        ],
      },
    },
    {
      spec: "gender not a string",
      input: { ...validDriverInput, gender: 123 },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [
          {
            gender: "Invalid option: expected one of 'male'|'female'|'other'|'undisclosed'",
          },
        ],
      },
    },

    {
      spec: "missing address",
      input: { ...validDriverInput, address: undefined },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ address: "Invalid input: expected string, received undefined" }],
      },
    },
    {
      spec: "address too short",
      input: { ...validDriverInput, address: "Short" },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ address: "Too small: expected string to have >=10 characters" }],
      },
    },
    {
      spec: "address too long",
      input: { ...validDriverInput, address: "A".repeat(256) },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ address: "Too big: expected string to have <=255 characters" }],
      },
    },
    {
      spec: "address not a string",
      input: { ...validDriverInput, address: 12_345 },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ address: "Invalid input: expected string, received number" }],
      },
    },

    {
      spec: "missing phone",
      input: { ...validDriverInput, phone: undefined },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ phone: "Invalid input: expected string, received undefined" }],
      },
    },
    {
      spec: "phone too short",
      input: { ...validDriverInput, phone: "123456789" },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ phone: "Too small: expected string to have >=10 characters" }],
      },
    },
    {
      spec: "phone too long",
      input: { ...validDriverInput, phone: "1".repeat(256) },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ phone: "Too big: expected string to have <=255 characters" }],
      },
    },
    {
      spec: "phone not a string",
      input: { ...validDriverInput, phone: 1_234_567_890 },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ phone: "Invalid input: expected string, received number" }],
      },
    },

    {
      spec: "missing vehicle",
      input: { ...validDriverInput, vehicle: undefined },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ vehicle: "Invalid input: expected string, received undefined" }],
      },
    },
    {
      spec: "vehicle too short",
      input: { ...validDriverInput, vehicle: "Car" },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ vehicle: "Too small: expected string to have >=10 characters" }],
      },
    },
    {
      spec: "vehicle too long",
      input: { ...validDriverInput, vehicle: "A".repeat(256) },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ vehicle: "Too big: expected string to have <=255 characters" }],
      },
    },
    {
      spec: "vehicle not a string",
      input: { ...validDriverInput, vehicle: 2021 },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ vehicle: "Invalid input: expected string, received number" }],
      },
    },

    {
      spec: "extra field (strictObject)",
      input: { ...validDriverInput, extraField: "not allowed" },
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
          { vehicle: expect.any(String) },
        ]),
      },
    },
  ],
};
