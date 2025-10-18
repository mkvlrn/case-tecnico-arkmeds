import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import type { Trip } from "@/domain/features/trip/trip.model";
import type { TripReceiptRepository } from "@/domain/features/trip/trip-receipt.repository";
import { AppError } from "@/domain/utils/app-error";
import { type AsyncResult, R } from "@/domain/utils/result";

export class FilesystemTripReceiptRepo implements TripReceiptRepository {
  private readonly outputDir: string;

  constructor(outputDir: string) {
    this.outputDir = outputDir;
  }

  async save(trip: Trip): AsyncResult<true, AppError> {
    try {
      const yyyymmdd = trip.datetime.toISOString().slice(0, 10);
      const hhmmss = trip.datetime.toISOString().slice(11, 19).replaceAll(":", "_");
      const filename = `${hhmmss}.txt`;
      const filepath = join(this.outputDir, trip.passengerId, yyyymmdd, filename);

      await mkdir(dirname(filepath), { recursive: true });
      await writeFile(filepath, JSON.stringify(trip, null, 2), "utf-8");

      return R.ok(true);
    } catch (err) {
      const msg = (err as Error).message;
      return R.error(new AppError("fsError", msg, err));
    }
  }
}
