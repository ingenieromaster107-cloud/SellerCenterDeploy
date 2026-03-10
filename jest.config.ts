import nextJest from "next/jest.js";

import type {Config} from 'jest';

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}", // Incluye todos los archivos TypeScript en la carpeta src
    "!src/**/*.d.ts",    // Excluye archivos de definición de TypeScript
    "!src/**/index.ts",   // Excluye archivos index.ts
    "!src/_mock/**"
  ],
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: [
    "\\\\node_modules\\\\"
  ],
  coverageProvider: "v8",
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jsdom",
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)"
  ],
  testPathIgnorePatterns: [
    "<rootDir>/.next/",
    "<rootDir>/node_modules/",
    "<rootDir>/src/_mock/"
  ],
};

export default createJestConfig(config);
