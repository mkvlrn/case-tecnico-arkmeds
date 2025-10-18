import { beforeEach, expect, test } from "@jest/globals";
import type { Channel, ChannelModel } from "amqplib";
import { type DeepMockProxy, mockDeep } from "jest-mock-extended";
import type { Trip } from "@/domain/features/trip/trip.model";
import { TRIP_NOTIFICATION_QUEUE } from "@/domain/utils/constants";
import { TripAmqpPublish } from "@/infra/amqp/trip.amqp-publish";

const validTrip: Trip = {
  passengerId: "test-passenger-id",
  datetime: new Date("2024-01-01T10:00:00Z"),
  distanceInKm: 10.5,
  price: 25.75,
};

let amqp: DeepMockProxy<ChannelModel>;
let channel: DeepMockProxy<Channel>;
let notifier: TripAmqpPublish;

beforeEach(() => {
  amqp = mockDeep<ChannelModel>();
  channel = mockDeep<Channel>();
  notifier = new TripAmqpPublish(amqp);
});

test("should create channel, assert queue, and send trip notification", async () => {
  amqp.createChannel.mockResolvedValue(channel);
  channel.assertQueue.mockResolvedValue({} as never);
  channel.sendToQueue.mockReturnValue(true);

  await notifier.notify(validTrip);

  expect(amqp.createChannel).toHaveBeenCalledTimes(1);
  expect(channel.assertQueue).toHaveBeenCalledWith(TRIP_NOTIFICATION_QUEUE);
  expect(channel.sendToQueue).toHaveBeenCalledWith(
    TRIP_NOTIFICATION_QUEUE,
    Buffer.from(JSON.stringify(validTrip)),
  );
});

test("should serialize trip correctly before sending", async () => {
  amqp.createChannel.mockResolvedValue(channel);
  channel.assertQueue.mockResolvedValue({} as never);
  channel.sendToQueue.mockReturnValue(true);

  await notifier.notify(validTrip);

  const expectedBuffer = Buffer.from(JSON.stringify(validTrip));
  expect(channel.sendToQueue).toHaveBeenCalledWith(TRIP_NOTIFICATION_QUEUE, expectedBuffer);
});

test("should use correct queue name from constants", async () => {
  amqp.createChannel.mockResolvedValue(channel);
  channel.assertQueue.mockResolvedValue({} as never);
  channel.sendToQueue.mockReturnValue(true);

  await notifier.notify(validTrip);

  expect(channel.assertQueue).toHaveBeenCalledWith("trip-notification");
  expect(channel.sendToQueue).toHaveBeenCalledWith("trip-notification", expect.any(Buffer));
});

test("should throw error if channel creation fails", async () => {
  const expectedError = new Error("connection failed");
  amqp.createChannel.mockRejectedValue(expectedError);

  await expect(notifier.notify(validTrip)).rejects.toThrow("connection failed");
  expect(channel.assertQueue).not.toHaveBeenCalled();
  expect(channel.sendToQueue).not.toHaveBeenCalled();
});

test("should throw error if queue assertion fails", async () => {
  const expectedError = new Error("queue assertion failed");
  amqp.createChannel.mockResolvedValue(channel);
  channel.assertQueue.mockRejectedValue(expectedError);

  await expect(notifier.notify(validTrip)).rejects.toThrow("queue assertion failed");
  expect(amqp.createChannel).toHaveBeenCalledTimes(1);
  expect(channel.sendToQueue).not.toHaveBeenCalled();
});
