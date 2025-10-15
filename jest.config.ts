import type { Config } from "jest";
import { createDefaultEsmPreset } from "ts-jest";

export default {
  ...createDefaultEsmPreset(),
  collectCoverage: false,
  collectCoverageFrom: ["src/**/*.ts"],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  passWithNoTests: true,
  verbose: true,
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
} satisfies Config;
