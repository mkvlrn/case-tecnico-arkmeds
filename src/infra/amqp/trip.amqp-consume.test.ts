import { beforeEach, expect, jest, test } from "@jest/globals";
import type { Channel, ChannelModel, ConsumeMessage } from "amqplib";
import { type DeepMockProxy, mockDeep } from "jest-mock-extended";
import type { Logger } from "pino";
import type { Trip } from "@/domain/features/trip/trip.model";
import { TRIP_NOTIFICATION_QUEUE } from "@/domain/utils/constants";
import { TripAmqpConsumer } from "@/infra/amqp/trip.amqp-consume";

const validTrip: Trip = {
  passengerId: "test-passenger-id",
  datetime: new Date("2024-01-01T10:00:00Z"),
  distanceInKm: 10.5,
  price: 25.75,
};

let amqp: DeepMockProxy<ChannelModel>;
let channel: DeepMockProxy<Channel>;
let consumer: TripAmqpConsumer;
let mockHandler: jest.Mock<(trip: Trip) => Promise<void>>;

beforeEach(() => {
  amqp = mockDeep<ChannelModel>();
  channel = mockDeep<Channel>();
  consumer = new TripAmqpConsumer(amqp, mockDeep<Logger>());
  mockHandler = jest.fn();
});

test("should create channel, assert queue, and set up consumer", async () => {
  amqp.createChannel.mockResolvedValue(channel);
  channel.assertQueue.mockResolvedValue({} as never);
  channel.consume.mockResolvedValue({} as never);

  await consumer.consume(mockHandler);

  expect(amqp.createChannel).toHaveBeenCalledTimes(1);
  expect(channel.assertQueue).toHaveBeenCalledWith(TRIP_NOTIFICATION_QUEUE);
  expect(channel.consume).toHaveBeenCalledWith(TRIP_NOTIFICATION_QUEUE, expect.any(Function));
});

test("should parse message and call handler when message is received", async () => {
  amqp.createChannel.mockResolvedValue(channel);
  channel.assertQueue.mockResolvedValue({} as never);
  let messageCallback: ((msg: ConsumeMessage | null) => Promise<void>) | undefined;
  channel.consume.mockImplementation((_queue, callback) => {
    messageCallback = callback as (msg: ConsumeMessage | null) => Promise<void>;
    return {} as never;
  });

  await consumer.consume(mockHandler);
  const mockMessage = {
    content: Buffer.from(JSON.stringify(validTrip)),
  } as ConsumeMessage;
  await messageCallback?.(mockMessage);

  expect(mockHandler).toHaveBeenCalledWith(validTrip);
  expect(channel.ack).toHaveBeenCalledWith(mockMessage);
});

test("should acknowledge message after successful processing", async () => {
  amqp.createChannel.mockResolvedValue(channel);
  channel.assertQueue.mockResolvedValue({} as never);
  let messageCallback: ((msg: ConsumeMessage | null) => Promise<void>) | undefined;
  channel.consume.mockImplementation((_queue, callback) => {
    messageCallback = callback as (msg: ConsumeMessage | null) => Promise<void>;
    return {} as never;
  });

  await consumer.consume(mockHandler);
  const mockMessage = {
    content: Buffer.from(JSON.stringify(validTrip)),
  } as ConsumeMessage;
  await messageCallback?.(mockMessage);

  expect(channel.ack).toHaveBeenCalledWith(mockMessage);
  expect(channel.nack).not.toHaveBeenCalled();
});

test("should nack message without requeue if handler fails", async () => {
  const handlerError = new Error("handler failed");
  mockHandler.mockRejectedValue(handlerError);
  amqp.createChannel.mockResolvedValue(channel);
  channel.assertQueue.mockResolvedValue({} as never);
  let messageCallback: ((msg: ConsumeMessage | null) => Promise<void>) | undefined;
  channel.consume.mockImplementation((_queue, callback) => {
    messageCallback = callback as (msg: ConsumeMessage | null) => Promise<void>;
    return {} as never;
  });

  await consumer.consume(mockHandler);
  const mockMessage = {
    content: Buffer.from(JSON.stringify(validTrip)),
  } as ConsumeMessage;
  await messageCallback?.(mockMessage);

  expect(mockHandler).toHaveBeenCalledWith(validTrip);
  expect(channel.nack).toHaveBeenCalledWith(mockMessage, false, false);
  expect(channel.ack).not.toHaveBeenCalled();
});

test("should nack message without requeue if JSON parsing fails", async () => {
  amqp.createChannel.mockResolvedValue(channel);
  channel.assertQueue.mockResolvedValue({} as never);
  let messageCallback: ((msg: ConsumeMessage | null) => Promise<void>) | undefined;
  channel.consume.mockImplementation((_queue, callback) => {
    messageCallback = callback as (msg: ConsumeMessage | null) => Promise<void>;
    return {} as never;
  });

  await consumer.consume(mockHandler);
  const mockMessage = {
    content: Buffer.from("invalid json"),
  } as ConsumeMessage;
  await messageCallback?.(mockMessage);

  expect(mockHandler).not.toHaveBeenCalled();
  expect(channel.nack).toHaveBeenCalledWith(mockMessage, false, false);
  expect(channel.ack).not.toHaveBeenCalled();
});

test("should do nothing if message is null", async () => {
  amqp.createChannel.mockResolvedValue(channel);
  channel.assertQueue.mockResolvedValue({} as never);
  let messageCallback: ((msg: ConsumeMessage | null) => Promise<void>) | undefined;
  channel.consume.mockImplementation((_queue, callback) => {
    messageCallback = callback as (msg: ConsumeMessage | null) => Promise<void>;
    return {} as never;
  });

  await consumer.consume(mockHandler);
  await messageCallback?.(null);

  expect(mockHandler).not.toHaveBeenCalled();
  expect(channel.ack).not.toHaveBeenCalled();
  expect(channel.nack).not.toHaveBeenCalled();
});

test("should use correct queue name from constants", async () => {
  amqp.createChannel.mockResolvedValue(channel);
  channel.assertQueue.mockResolvedValue({} as never);
  channel.consume.mockResolvedValue({} as never);

  await consumer.consume(mockHandler);

  expect(channel.assertQueue).toHaveBeenCalledWith("trip-notification");
  expect(channel.consume).toHaveBeenCalledWith("trip-notification", expect.any(Function));
});

test("should throw error if channel creation fails", async () => {
  const expectedError = new Error("connection failed");
  amqp.createChannel.mockRejectedValue(expectedError);

  await expect(consumer.consume(mockHandler)).rejects.toThrow("connection failed");

  expect(channel.assertQueue).not.toHaveBeenCalled();
  expect(channel.consume).not.toHaveBeenCalled();
});

test("should throw error if queue assertion fails", async () => {
  const expectedError = new Error("queue assertion failed");
  amqp.createChannel.mockResolvedValue(channel);
  channel.assertQueue.mockRejectedValue(expectedError);

  await expect(consumer.consume(mockHandler)).rejects.toThrow("queue assertion failed");
  expect(amqp.createChannel).toHaveBeenCalledTimes(1);
  expect(channel.consume).not.toHaveBeenCalled();
});
