import { expect } from "@jest/globals";
import { StatusCodes } from "http-status-codes";
import type { CreateTripSchema } from "@/adapters/api/validation-schemas/trip.schema";

const validTripInput = {
  passengerId: "okmclejrj1xegofrbc164ie0",
  requestId: "test-fare-request-id-123",
} satisfies CreateTripSchema;

export const createTrip = {
  success: {
    input: validTripInput,
    output: {
      passengerId: validTripInput.passengerId,
      datetime: expect.any(String),
      distanceInKm: expect.any(Number),
      price: expect.any(Number),
    },
  },

  fail: [
    // ===== passengerId validation =====
    {
      spec: "missing passengerId",
      input: { ...validTripInput, passengerId: undefined },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ passengerId: "Invalid input: expected string, received undefined" }],
      },
    },
    {
      spec: "passengerId not a string (number)",
      input: { ...validTripInput, passengerId: 12_345 },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ passengerId: "Invalid input: expected string, received number" }],
      },
    },
    {
      spec: "passengerId not a string (null)",
      input: { ...validTripInput, passengerId: null },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ passengerId: "Invalid input: expected string, received null" }],
      },
    },
    {
      spec: "passenger not found",
      input: { ...validTripInput, passengerId: "non-existent-passenger-id" },
      statusCode: StatusCodes.NOT_FOUND,
      error: {
        code: "resourceNotFound",
        message: "passenger with id non-existent-passenger-id not found",
      },
    },

    // ===== requestId validation =====
    {
      spec: "missing requestId",
      input: { ...validTripInput, requestId: undefined },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ requestId: "Invalid input: expected string, received undefined" }],
      },
    },
    {
      spec: "requestId not a string (number)",
      input: { ...validTripInput, requestId: 12_345 },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ requestId: "Invalid input: expected string, received number" }],
      },
    },
    {
      spec: "requestId not a string (null)",
      input: { ...validTripInput, requestId: null },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ requestId: "Invalid input: expected string, received null" }],
      },
    },
    {
      spec: "fare not found",
      input: { ...validTripInput, requestId: "non-existent-fare-id" },
      statusCode: StatusCodes.NOT_FOUND,
      error: {
        code: "resourceNotFound",
        message: "fare with id non-existent-fare-id not found",
      },
    },

    // ===== strictObject validation =====
    {
      spec: "extra field (strictObject)",
      input: { ...validTripInput, extraField: "not allowed" },
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
          { passengerId: expect.any(String) },
          { requestId: expect.any(String) },
        ]),
      },
    },
  ],
};
