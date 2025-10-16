import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";
import { AppError } from "@/domain/utils/app-error";

type Target = "body" | "query";

export function validation(schema: ZodType, target: Target = "body") {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req[target]);
    if (!parsed.success) {
      const details = parsed.error.issues.map((i) => ({
        [i.path.join(".")]: i.message.replaceAll('"', "'"),
      }));
      throw new AppError("invalidInput", "input/query is invalid or incomplete", details);
    }

    if (target === "body") {
      req[target] = parsed.data;
    }

    return next();
  };
}
