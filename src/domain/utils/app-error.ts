import { getReasonPhrase, StatusCodes } from "http-status-codes";

export type ErrorCode = "invalidInput" | "databaseError" | "resourceNotFound";

export class AppError extends Error {
  static readonly errorToStatus: Record<ErrorCode, StatusCodes> = {
    invalidInput: StatusCodes.UNPROCESSABLE_ENTITY,
    databaseError: StatusCodes.INTERNAL_SERVER_ERROR,
    resourceNotFound: StatusCodes.NOT_FOUND,
  };

  readonly code: ErrorCode;
  readonly status: string;
  readonly statusCode: StatusCodes;

  constructor(code: ErrorCode, message: string, cause?: unknown) {
    super(message);
    this.name = "AppError";
    this.cause = cause;
    this.code = code;

    const statusCode = AppError.errorToStatus[code];
    this.status = getReasonPhrase(statusCode);
    this.statusCode = statusCode;
  }

  serialize() {
    return {
      code: this.code,
      message: this.message,
      details: this.cause,
    };
  }
}
