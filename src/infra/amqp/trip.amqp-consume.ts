import type { ChannelModel } from "amqplib";
import type { Logger } from "pino";
import type { TripConsumer } from "@/domain/features/trip/trip.consumer";
import type { Trip } from "@/domain/features/trip/trip.model";
import { TRIP_NOTIFICATION_QUEUE } from "@/domain/utils/constants";

export class TripAmqpConsumer implements TripConsumer {
  private readonly amqp: ChannelModel;
  private readonly pino: Logger;

  constructor(amqp: ChannelModel, pino: Logger) {
    this.amqp = amqp;
    this.pino = pino;
  }

  async consume(handler: (trip: Trip) => Promise<void>): Promise<void> {
    const ch = await this.amqp.createChannel();
    await ch.assertQueue(TRIP_NOTIFICATION_QUEUE);

    await ch.consume(TRIP_NOTIFICATION_QUEUE, async (msg) => {
      if (msg) {
        try {
          const parsed = JSON.parse(msg.content.toString());
          const trip: Trip = { ...parsed, datetime: new Date(parsed.datetime) };
          await handler(trip);
          ch.ack(msg);
        } catch (err) {
          this.pino.error(err);
          ch.nack(msg, false, false);
        }
      }
    });
  }
}
