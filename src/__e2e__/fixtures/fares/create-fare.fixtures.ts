import { expect } from "@jest/globals";
import { StatusCodes } from "http-status-codes";
import type { CreateFareSchema } from "@/adapters/api/validation-schemas/fare.schema";
import { FARE_VALIDATION } from "@/domain/utils/constants";

function getFutureDate(daysFromNow: number, hour: number, minute: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hour, minute, 0, 0);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+00:00`;
}

function getPastDate(): string {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  date.setHours(14, 30, 0, 0);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+00:00`;
}

const validFareInput = {
  originLatitude: 40.7128,
  originLongitude: -74.006,
  destinationLatitude: 34.0522,
  destinationLongitude: -118.2437,
  datetime: getFutureDate(7, 14, 30), // 7 days from now, 2:30 PM
} satisfies CreateFareSchema;

export const createFare = {
  success: {
    input: validFareInput,
    output: {
      ...validFareInput,
      requestId: expect.any(String),
      datetime: expect.any(String),
      price: expect.any(Number),
    },
  },

  fail: [
    // ===== originLatitude validation =====
    {
      spec: "missing originLatitude",
      input: { ...validFareInput, originLatitude: undefined },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ originLatitude: FARE_VALIDATION.latitude.message }],
      },
    },
    {
      spec: "originLatitude below minimum",
      input: { ...validFareInput, originLatitude: -91 },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ originLatitude: FARE_VALIDATION.latitude.message }],
      },
    },
    {
      spec: "originLatitude above maximum",
      input: { ...validFareInput, originLatitude: 91 },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ originLatitude: FARE_VALIDATION.latitude.message }],
      },
    },
    {
      spec: "originLatitude not a number (string)",
      input: { ...validFareInput, originLatitude: "40.7128" },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ originLatitude: FARE_VALIDATION.latitude.message }],
      },
    },
    {
      spec: "originLatitude is null",
      input: { ...validFareInput, originLatitude: null },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ originLatitude: FARE_VALIDATION.latitude.message }],
      },
    },

    // ===== originLongitude validation =====
    {
      spec: "missing originLongitude",
      input: { ...validFareInput, originLongitude: undefined },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ originLongitude: FARE_VALIDATION.longitude.message }],
      },
    },
    {
      spec: "originLongitude below minimum",
      input: { ...validFareInput, originLongitude: -181 },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ originLongitude: FARE_VALIDATION.longitude.message }],
      },
    },
    {
      spec: "originLongitude above maximum",
      input: { ...validFareInput, originLongitude: 181 },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ originLongitude: FARE_VALIDATION.longitude.message }],
      },
    },
    {
      spec: "originLongitude not a number (string)",
      input: { ...validFareInput, originLongitude: "-74.006" },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ originLongitude: FARE_VALIDATION.longitude.message }],
      },
    },
    {
      spec: "originLongitude is null",
      input: { ...validFareInput, originLongitude: null },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ originLongitude: FARE_VALIDATION.longitude.message }],
      },
    },

    // ===== destinationLatitude validation =====
    {
      spec: "missing destinationLatitude",
      input: { ...validFareInput, destinationLatitude: undefined },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ destinationLatitude: FARE_VALIDATION.latitude.message }],
      },
    },
    {
      spec: "destinationLatitude below minimum",
      input: { ...validFareInput, destinationLatitude: -91 },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ destinationLatitude: FARE_VALIDATION.latitude.message }],
      },
    },
    {
      spec: "destinationLatitude above maximum",
      input: { ...validFareInput, destinationLatitude: 91 },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ destinationLatitude: FARE_VALIDATION.latitude.message }],
      },
    },
    {
      spec: "destinationLatitude not a number (string)",
      input: { ...validFareInput, destinationLatitude: "34.0522" },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ destinationLatitude: FARE_VALIDATION.latitude.message }],
      },
    },
    {
      spec: "destinationLatitude is null",
      input: { ...validFareInput, destinationLatitude: null },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ destinationLatitude: FARE_VALIDATION.latitude.message }],
      },
    },

    // ===== destinationLongitude validation =====
    {
      spec: "missing destinationLongitude",
      input: { ...validFareInput, destinationLongitude: undefined },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ destinationLongitude: FARE_VALIDATION.longitude.message }],
      },
    },
    {
      spec: "destinationLongitude below minimum",
      input: { ...validFareInput, destinationLongitude: -181 },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ destinationLongitude: FARE_VALIDATION.longitude.message }],
      },
    },
    {
      spec: "destinationLongitude above maximum",
      input: { ...validFareInput, destinationLongitude: 181 },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ destinationLongitude: FARE_VALIDATION.longitude.message }],
      },
    },
    {
      spec: "destinationLongitude not a number (string)",
      input: { ...validFareInput, destinationLongitude: "-118.2437" },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ destinationLongitude: FARE_VALIDATION.longitude.message }],
      },
    },
    {
      spec: "destinationLongitude is null",
      input: { ...validFareInput, destinationLongitude: null },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ destinationLongitude: FARE_VALIDATION.longitude.message }],
      },
    },

    // ===== datetime validation =====
    {
      spec: "missing datetime",
      input: { ...validFareInput, datetime: undefined },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ datetime: "Invalid input: expected string, received undefined" }],
      },
    },
    {
      spec: "datetime without offset",
      input: { ...validFareInput, datetime: "2025-06-15T14:30" },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ datetime: "Invalid ISO datetime" }],
      },
    },
    {
      spec: "datetime without seconds (invalid precision)",
      input: { ...validFareInput, datetime: "2025-06-15T14:30+00:00" },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ datetime: "Invalid ISO datetime" }],
      },
    },
    {
      spec: "datetime with milliseconds (invalid precision)",
      input: { ...validFareInput, datetime: "2025-06-15T14:30:00.123+00:00" },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ datetime: "Invalid ISO datetime" }],
      },
    },
    {
      spec: "datetime not ISO format",
      input: { ...validFareInput, datetime: "06/15/2025 2:30 PM" },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ datetime: "Invalid ISO datetime" }],
      },
    },
    {
      spec: "datetime not a string (number)",
      input: { ...validFareInput, datetime: 1_705_329_000_000 },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ datetime: "Invalid input: expected string, received number" }],
      },
    },
    {
      spec: "datetime is null",
      input: { ...validFareInput, datetime: null },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ datetime: "Invalid input: expected string, received null" }],
      },
    },
    {
      spec: "datetime in the past",
      input: { ...validFareInput, datetime: getPastDate() },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "datetime cannot be in the past",
      },
    },

    // ===== strictObject validation =====
    {
      spec: "extra field (strictObject)",
      input: { ...validFareInput, extraField: "not allowed" },
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
          { originLatitude: expect.any(String) },
          { originLongitude: expect.any(String) },
          { destinationLatitude: expect.any(String) },
          { destinationLongitude: expect.any(String) },
          { datetime: expect.any(String) },
        ]),
      },
    },
  ],
};
