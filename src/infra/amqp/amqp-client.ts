import { type ChannelModel, connect } from "amqplib";

let amqp: ChannelModel | null = null;

export async function getAmpq(url: string) {
  if (!amqp) {
    amqp = (await connect(url)).on("error", (err) => console.error(err));
  }

  return amqp;
}
