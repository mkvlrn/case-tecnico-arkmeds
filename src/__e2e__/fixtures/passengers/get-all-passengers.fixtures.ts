import { expect } from "@jest/globals";
import { StatusCodes } from "http-status-codes";
import { PAGINATION_VALIDATION } from "@/domain/utils/constants";

export const getAllPassengers = {
  success: [
    {
      spec: "default page (page 1)",
      query: {},
      output: {
        total: 13,
        totalPages: 2,
        page: 1,
        items: expect.any(Array),
      },
    },
    {
      spec: "specific page",
      query: { page: 2 },
      output: {
        total: 13,
        totalPages: 2,
        page: 2,
        items: expect.any(Array),
      },
    },
  ],

  fail: [
    {
      spec: "negative page number",
      query: { page: -1 },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ page: PAGINATION_VALIDATION.page.message }],
      },
    },
    {
      spec: "zero page number",
      query: { page: 0 },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ page: PAGINATION_VALIDATION.page.message }],
      },
    },
    {
      spec: "invalid page type (string)",
      query: { page: "invalid" },
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        code: "invalidInput",
        message: "input/query is invalid or incomplete",
        details: [{ page: PAGINATION_VALIDATION.page.message }],
      },
    },
  ],
};
