import { afterEach, expect, jest, test } from "@jest/globals";
import type { ChannelModel } from "amqplib";
import { mock } from "jest-mock-extended";

jest.unstable_mockModule("amqplib", () => ({
  connect: jest.fn().mockReturnValue(mock<ChannelModel>()),
}));

const mockUrl = "amqp://localhost";

afterEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

test("should return the same AmqpLib client instance on subsequent calls", async () => {
  const { getAmpq } = await import("@/infra/amqp/amqp-client");

  const amqp1 = await getAmpq(mockUrl);
  const amqp2 = await getAmpq(mockUrl);

  expect(amqp1).toBe(amqp2);
});
