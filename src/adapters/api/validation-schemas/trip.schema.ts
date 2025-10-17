import { z } from "zod";

export const CreateTripSchema = z.strictObject({
  passengerId: z.string(),
  requestId: z.string(),
});
export type CreateTripSchema = z.infer<typeof CreateTripSchema>;
