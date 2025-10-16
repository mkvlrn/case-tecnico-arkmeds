import type { Config } from "jest";
import { createDefaultEsmPreset } from "ts-jest";

export default {
  ...createDefaultEsmPreset(),
  collectCoverage: false,
  collectCoverageFrom: ["src/**/*.ts"],
  coveragePathIgnorePatterns: [
    "src/generated", // prisma generated code
    "src/.*\\.model\\.ts$", // interfaces
    "src/.*\\.repository\\.ts$", // also interfaces
  ],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  passWithNoTests: true,
  verbose: true,
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
} satisfies Config;
