import type { ChannelModel } from "amqplib";
import type { Trip } from "@/domain/features/trip/trip.model";
import type { TripNotifier } from "@/domain/features/trip/trip.notifier";
import { TRIP_NOTIFICATION_QUEUE } from "@/domain/utils/constants";

export class TripAmqpPublish implements TripNotifier {
  private readonly amqp: ChannelModel;

  constructor(amqp: ChannelModel) {
    this.amqp = amqp;
  }

  async notify(trip: Trip): Promise<void> {
    const ch = await this.amqp.createChannel();
    await ch.assertQueue(TRIP_NOTIFICATION_QUEUE);

    ch.sendToQueue(TRIP_NOTIFICATION_QUEUE, Buffer.from(JSON.stringify(trip)));
  }
}
