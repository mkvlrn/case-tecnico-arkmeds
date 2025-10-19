import { afterEach, expect, jest, test } from "@jest/globals";
import { getPino } from "@/infra/pino/pino-logger";

jest.mock("pino");

afterEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

test("should return the same Pino instance on subsequent calls", () => {
  const pino1 = getPino();
  const pino2 = getPino();

  expect(pino1).toBe(pino2);
});
