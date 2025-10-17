import { z } from "zod";

export const CreateFareSchema = z.strictObject({
  passengerId: z.string(),
  originLatitude: z.number(),
  originLongitude: z.number(),
  destinationLatitude: z.number(),
  destinationLongitude: z.number(),
  datetime: z.iso.datetime({ offset: true, precision: -1 }),
});
export type CreateFareSchema = z.infer<typeof CreateFareSchema>;
