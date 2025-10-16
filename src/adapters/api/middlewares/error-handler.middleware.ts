import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "@/domain/utils/app-error";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json(err.serialize());
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    code: "internalServerError",
    message: (err as Error).message,
    details: (err as Error).cause,
  });
}
