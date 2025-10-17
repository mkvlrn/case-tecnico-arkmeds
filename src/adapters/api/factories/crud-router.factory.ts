import type { NextFunction, Request, Response } from "express";
import { Router } from "express";
import type { ZodType } from "zod";
import { validation } from "@/adapters/api/middlewares/validation.middleware";
import { PaginatedResultQuery } from "@/adapters/api/validation-schemas/paginated-result.schema";

interface Controller {
  handle(req: Request, res: Response, next: NextFunction): Promise<void>;
}

interface CrudControllers {
  create: Controller;
  getAll: Controller;
  getById: Controller;
  update: Controller;
  delete: Controller;
}

export function createCrudRouter(controllers: CrudControllers, schema: ZodType): Router {
  const router = Router();

  router.post("/", validation(schema), controllers.create.handle.bind(controllers.create));
  router.get(
    "/",
    validation(PaginatedResultQuery, "query"),
    controllers.getAll.handle.bind(controllers.getAll),
  );
  router.get("/:id", controllers.getById.handle.bind(controllers.getById));
  router.put("/:id", validation(schema), controllers.update.handle.bind(controllers.update));
  router.delete("/:id", controllers.delete.handle.bind(controllers.delete));

  return router;
}
