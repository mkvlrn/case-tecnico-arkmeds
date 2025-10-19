import { type ChannelModel, connect } from "amqplib";
import type { Logger } from "pino";

let amqp: ChannelModel | null = null;

export async function getAmpq(url: string, pino: Logger) {
  if (!amqp) {
    amqp = (await connect(url)).on("error", (err) => pino.error(err));
  }

  return amqp;
}
