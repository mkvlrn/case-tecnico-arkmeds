import process from "node:process";
import type { Config } from "jest";
import { createDefaultEsmPreset } from "ts-jest";

const isE2E = process.env["E2E"] === "true";
const testMatch = ["<rootDir>/src/**/*.test.ts"];
if (isE2E) {
  testMatch.push("<rootDir>/src/**/*.spec.ts");
}

export default {
  ...createDefaultEsmPreset(),
  testMatch,
  collectCoverage: false,
  collectCoverageFrom: ["<rootDir>/src/**/*.ts"],
  coveragePathIgnorePatterns: [
    "src/generated", // prisma generated code
    "src/.*\\.model\\.ts$", // interfaces
    "src/.*\\.repository\\.ts$", // also interfaces
    "src/.*fixtures\\.ts$", // fixture files don't have production code
    "constants.ts", // not production code
    "setup.ts", // not production code
    "src/.*\\.spec.ts$", // e2e tests
  ],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  passWithNoTests: true,
  verbose: !isE2E,
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@redis/client$": "<rootDir>/src/__mocks__/@redis/client.ts",
    "^@/generated/prisma/client$": "<rootDir>/src/__mocks__/@/generated/prisma/client.ts",
  },
} satisfies Config;
