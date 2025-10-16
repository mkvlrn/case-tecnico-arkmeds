import { z } from "zod";
import { PAGINATION_VALIDATION } from "@/domain/utils/constants";

export const PaginatedResultQuery = z.object({
  page: z.coerce
    .number({ error: PAGINATION_VALIDATION.page.message })
    .positive({ error: PAGINATION_VALIDATION.page.message })
    .default(1),
});
export type PaginatedResultQuery = z.infer<typeof PaginatedResultQuery>;
