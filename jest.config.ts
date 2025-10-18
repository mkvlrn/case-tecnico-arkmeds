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
    "src/.*\\.(test|spec).ts$", // test files
    "src/.*\\.(model|repository|notifier|consumer)\\.ts$", // interfaces
    "src/generated", // prisma generated code
    "src/.*fixtures\\.ts$", // fixture files don't have production code
    "constants.ts", // not production code
    "setup.ts", // not production code
  ],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  passWithNoTests: true,
  verbose: !isE2E,
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
} satisfies Config;
