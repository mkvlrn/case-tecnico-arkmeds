import logger, { type Logger } from "pino";

let pino: Logger | null = null;

export function getPino() {
  if (!pino) {
    pino = logger();
  }

  return pino;
}
