import { execSync } from "node:child_process";
import process from "node:process";
import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";
import { PrismaPg } from "@prisma/adapter-pg";
import { PostgreSqlContainer, type StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { StatusCodes } from "http-status-codes";
import supertest, { type Agent } from "supertest";
import { createDriver } from "@/__e2e__/create-driver.fixtures";
import { getServer } from "@/adapters/api/server";
import { PrismaClient } from "@/generated/prisma/client";

const TEST_HOOK_TIMEOUT = 30_000;

let db: StartedPostgreSqlContainer;
let prisma: PrismaClient;
let server: Agent;

beforeAll(async () => {
  db = await new PostgreSqlContainer("postgres:alpine").start();
  const prismaPg = new PrismaPg({ connectionString: db.getConnectionUri() });
  prisma = new PrismaClient({ adapter: prismaPg });
  execSync("prisma migrate deploy", {
    env: { ...process.env, DATABASE_URL: db.getConnectionUri() },
  });
  server = supertest(getServer(prisma));
}, TEST_HOOK_TIMEOUT);

afterAll(async () => {
  await prisma.$disconnect();
  await db.stop();
});

describe("POST /drivers", () => {
  test("should create a driver", async () => {
    const response = await server
      .post("/drivers")
      .set("Content-Type", "application/json")
      .send(JSON.stringify(createDriver.success.input));

    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.body).toStrictEqual(createDriver.success.output);
  });

  test.each(createDriver.fail)("should fail on $spec", async ({ input, error, statusCode }) => {
    const response = await server
      .post("/drivers")
      .set("Content-Type", "application/json")
      .send(JSON.stringify(input));

    expect(response.status).toStrictEqual(statusCode);
    expect(response.body).toStrictEqual(error);
  });
});
