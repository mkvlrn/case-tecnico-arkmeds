import { strip } from "@fnando/cpf";
import { expect } from "@jest/globals";
import { StatusCodes } from "http-status-codes";
import { phone } from "phone";
import type { CreateDriverSchema } from "@/adapters/api/validation-schemas/driver.schema";
import { USER_VALIDATION } from "@/domain/utils/constants";

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
    output: {
      ...validDriverInput,
      id: expect.any(String),
      cpf: strip(validDriverInput.cpf),
      phone: phone(validDriverInput.phone).phoneNumber,
    },
  },

  fail: [
    {
      spec: "cpf conflict",
      input: validDriverInput,
      statusCode: StatusCodes.CONFLICT,
      error: {
        code: "resourceConflict",
        message: `driver with cpf ${strip(validDriverInput.cpf)} already exists`,
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
        details: [{ name: USER_VALIDATION.name.message }],
      },
    },
    {
      spec: "name too long",
      input: { ...validDriverInput, name: "A".repeat(81) },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ name: USER_VALIDATION.name.message }],
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
        details: [{ cpf: USER_VALIDATION.cpf.message }],
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
        details: [{ dateOfBirth: USER_VALIDATION.dateOfBirth.messageFormat }],
      },
    },
    {
      spec: "invalid dateOfBirth month",
      input: { ...validDriverInput, dateOfBirth: "1999-13-01" },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ dateOfBirth: USER_VALIDATION.dateOfBirth.messageFormat }],
      },
    },
    {
      spec: "invalid dateOfBirth day",
      input: { ...validDriverInput, dateOfBirth: "1999-01-32" },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ dateOfBirth: USER_VALIDATION.dateOfBirth.messageFormat }],
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
      spec: "driver is too young",
      input: {
        ...validDriverInput,
        dateOfBirth: new Date(Date.now() - 17 * 365.25 * 24 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 10),
      },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ dateOfBirth: USER_VALIDATION.dateOfBirth.messageDriverAge }],
      },
    },

    {
      spec: "missing gender",
      input: { ...validDriverInput, gender: undefined },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ gender: USER_VALIDATION.gender.message }],
      },
    },
    {
      spec: "invalid gender value",
      input: { ...validDriverInput, gender: "unknown" },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ gender: USER_VALIDATION.gender.message }],
      },
    },
    {
      spec: "gender not a string",
      input: { ...validDriverInput, gender: 123 },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ gender: USER_VALIDATION.gender.message }],
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
        details: [{ address: USER_VALIDATION.address.message }],
      },
    },
    {
      spec: "address too long",
      input: { ...validDriverInput, address: "A".repeat(256) },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ address: USER_VALIDATION.address.message }],
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
      spec: "invalid phone format",
      input: { ...validDriverInput, phone: "123456789" },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ phone: USER_VALIDATION.phone.message }],
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
        details: [{ vehicle: USER_VALIDATION.vehicle.message }],
      },
    },
    {
      spec: "vehicle too long",
      input: { ...validDriverInput, vehicle: "A".repeat(256) },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ vehicle: USER_VALIDATION.vehicle.message }],
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
