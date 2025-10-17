import { jest } from "@jest/globals";
import type { RedisClientType } from "@redis/client";
import { mock } from "jest-mock-extended";

export const createClient = jest.fn().mockReturnValue(mock<RedisClientType>());
