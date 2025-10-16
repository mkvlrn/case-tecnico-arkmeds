import { z } from "zod";

export const PaginatedResultQuery = z.object({
  page: z.coerce.number().positive().default(1),
});
export type PaginatedResultQuery = z.infer<typeof PaginatedResultQuery>;
