import { jest } from "@jest/globals";
import type { ChannelModel } from "amqplib";
import { mock } from "jest-mock-extended";

export const connect = jest.fn().mockImplementation(async () => mock<ChannelModel>());
