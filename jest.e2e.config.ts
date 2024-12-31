import baseConfig from "./jest.config";

export default {
  ...baseConfig,
  testMatch: ["**/*.test.ts"],
  displayName: "e2e",
  setupFilesAfterEnv: ["<rootDir>/tests/setup.e2e.ts"],
};
