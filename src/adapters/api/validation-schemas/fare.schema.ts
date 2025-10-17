import { z } from "zod";
import { FARE_VALIDATION } from "@/domain/utils/constants";

export const CreateFareSchema = z.strictObject({
  originLatitude: z
    .number({ error: FARE_VALIDATION.latitude.message })
    .min(FARE_VALIDATION.latitude.min, { error: FARE_VALIDATION.latitude.message })
    .max(FARE_VALIDATION.latitude.max, { error: FARE_VALIDATION.latitude.message }),
  originLongitude: z
    .number({ error: FARE_VALIDATION.longitude.message })
    .min(FARE_VALIDATION.longitude.min, { error: FARE_VALIDATION.longitude.message })
    .max(FARE_VALIDATION.longitude.max, { error: FARE_VALIDATION.longitude.message }),
  destinationLatitude: z
    .number({ error: FARE_VALIDATION.latitude.message })
    .min(FARE_VALIDATION.latitude.min, { error: FARE_VALIDATION.latitude.message })
    .max(FARE_VALIDATION.latitude.max, { error: FARE_VALIDATION.latitude.message }),
  destinationLongitude: z
    .number({ error: FARE_VALIDATION.longitude.message })
    .min(FARE_VALIDATION.longitude.min, { error: FARE_VALIDATION.longitude.message })
    .max(FARE_VALIDATION.longitude.max, { error: FARE_VALIDATION.longitude.message }),
  datetime: z.iso.datetime({ offset: true, precision: 0 }),
});
export type CreateFareSchema = z.infer<typeof CreateFareSchema>;
