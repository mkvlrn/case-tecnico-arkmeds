import type { PrismaClient } from "@prisma/client";
import type { RedisClientType } from "@redis/client";
import type { ChannelModel } from "amqplib";
import { createContainer, InjectionMode } from "awilix";
import { registerControllers } from "@/infra/container/controllers.registry";
import { registerInfrastructure } from "@/infra/container/infra.registry";
import { registerRepositories } from "@/infra/container/repos.registry";
import { registerServices } from "@/infra/container/services.registry";
import type { AppContainer } from "@/infra/container/types";
import { registerUseCases } from "@/infra/container/usecases.registry";

export function configureContainer(
  prisma: PrismaClient,
  redis: RedisClientType,
  amqp: ChannelModel,
  faresTtl: number,
  receiptDir: string,
) {
  const container = createContainer<AppContainer>({
    injectionMode: InjectionMode.PROXY,
  });

  registerInfrastructure(container, prisma, redis, amqp, faresTtl, receiptDir);
  registerRepositories(container);
  registerServices(container);
  registerUseCases(container);
  registerControllers(container);

  return container;
}
