import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";
import { AppError } from "@/domain/utils/app-error";

export function validation(schema: ZodType) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse({ body: req.body, query: req.query, params: req.params });
    if (!parsed.success) {
      const details = parsed.error.issues.map((i) => ({
        [i.path.join(".")]: i.message.replaceAll('"', "'"),
      }));
      throw new AppError("invalidInput", "input/query is invalid or incomplete", details);
    }

    return next();
  };
}
