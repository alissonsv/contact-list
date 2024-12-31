import baseConfig from "./jest.config";

export default {
  ...baseConfig,
  testMatch: ["**/*.spec.ts"],
  displayName: "unit",
};
