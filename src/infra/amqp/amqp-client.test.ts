import { afterEach, expect, jest, test } from "@jest/globals";
import { connect } from "amqplib";
import { getAmpq } from "@/infra/amqp/amqp-client";

const mockUrl = "amqp://localhost";

afterEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

test("should return the same AmqpLib client instance on subsequent calls", async () => {
  const amqp1 = await getAmpq(mockUrl);
  const amqp2 = await getAmpq(mockUrl);

  expect(amqp1).toBe(amqp2);
  expect(connect).toHaveBeenCalledTimes(1);
});
