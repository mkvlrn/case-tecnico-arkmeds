import { z } from "zod";
import { TRIP_VALIDATION } from "@/domain/utils/constants";

export const CreateTripSchema = z.strictObject({
  passengerId: z.string().nonempty({ error: TRIP_VALIDATION.passengerId.message }),
  requestId: z.string().nonempty({ error: TRIP_VALIDATION.requestId.message }),
});
export type CreateTripSchema = z.infer<typeof CreateTripSchema>;
