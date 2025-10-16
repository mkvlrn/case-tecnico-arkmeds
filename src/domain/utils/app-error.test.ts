import { expect, test } from "@jest/globals";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import { AppError } from "@/domain/utils/app-error";

test("should create AppError with correct fields", () => {
  const err = new AppError("invalidInput", "Invalid data", [{ field: "name" }]);

  expect(err).toBeInstanceOf(Error);
  expect(err.name).toBe("AppError");
  expect(err.code).toBe("invalidInput");
  expect(err.message).toBe("Invalid data");
  expect(err.statusCode).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
  expect(err.status).toBe(getReasonPhrase(StatusCodes.UNPROCESSABLE_ENTITY));
  expect(err.cause).toEqual([{ field: "name" }]);
});

test("should serialize correctly", () => {
  const err = new AppError("databaseError", "DB exploded", { table: "users" });

  const serialized = err.serialize();

  expect(serialized).toEqual({
    code: "databaseError",
    message: "DB exploded",
    details: { table: "users" },
  });
});

test("should map all codes to proper status codes", () => {
  const codes = Object.keys(AppError.errorToStatus) as (keyof typeof AppError.errorToStatus)[];
  for (const code of codes) {
    const err = new AppError(code, "msg");
    expect(err.statusCode).toBe(AppError.errorToStatus[code]);
    expect(err.status).toBe(getReasonPhrase(AppError.errorToStatus[code]));
  }
});
