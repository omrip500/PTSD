export default {
  testEnvironment: "node",
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {},
  testMatch: ["**/__tests__/**/*.test.js", "**/?(*.)+(spec|test).js"],
  collectCoverageFrom: [
    "controllers/**/*.js",
    "models/**/*.js",
    "routes/**/*.js",
    "!**/node_modules/**",
  ],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  verbose: true,
};
