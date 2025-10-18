import { beforeAll, describe, expect, test } from "@jest/globals";
import type { RedisClientType } from "@redis/client";
import type { ChannelModel } from "amqplib";
import { StatusCodes } from "http-status-codes";
import { mockDeep } from "jest-mock-extended";
import supertest, { type Agent } from "supertest";
import { getServer } from "@/adapters/api/server";
import type { PrismaClient } from "@/generated/prisma/client";
import { configureContainer } from "@/infra/container";

let server: Agent;

beforeAll(() => {
  const container = configureContainer(
    mockDeep<PrismaClient>(),
    mockDeep<RedisClientType>(),
    mockDeep<ChannelModel>(),
    0,
    "./tmp",
  );

  server = supertest(getServer(container));
});

describe("GET /openapi.json", () => {
  test("should serve the OpenAPI specification file", async () => {
    const response = await server.get("/openapi.json");

    expect(response.status).toBe(StatusCodes.OK);
    // biome-ignore lint/performance/useTopLevelRegex: small enough, it's fine
    expect(response.headers["content-type"]).toMatch(/application\/json/);
    expect(response.body).toBeDefined();
  });

  test("should return valid OpenAPI 3.0 structure", async () => {
    const response = await server.get("/openapi.json");

    expect(response.body).toHaveProperty("openapi");
    expect(response.body).toHaveProperty("info");
    expect(response.body).toHaveProperty("paths");

    // biome-ignore lint/performance/useTopLevelRegex: small enough, it's fine
    expect(response.body.openapi).toMatch(/^3\.\d+\.\d+$/);
  });

  test("should include API metadata", async () => {
    const response = await server.get("/openapi.json");

    expect(response.body.info).toHaveProperty("title");
    expect(response.body.info).toHaveProperty("version");
    expect(typeof response.body.info.title).toBe("string");
    expect(typeof response.body.info.version).toBe("string");
  });

  test("should define paths for all API endpoints", async () => {
    const response = await server.get("/openapi.json");

    const paths = response.body.paths;
    expect(paths).toBeDefined();
    expect(typeof paths).toBe("object");

    expect(paths).toHaveProperty("/drivers");
    expect(paths).toHaveProperty("/passengers");
    expect(paths).toHaveProperty("/fares");
    expect(paths).toHaveProperty("/trips");
  });
});

describe("GET /docs", () => {
  test("should serve the API documentation page", async () => {
    const response = await server.get("/docs");

    expect(response.status).toBe(StatusCodes.OK);
    // biome-ignore lint/performance/useTopLevelRegex: small enough, it's fine
    expect(response.headers["content-type"]).toMatch(/text\/html/);
  });
});
