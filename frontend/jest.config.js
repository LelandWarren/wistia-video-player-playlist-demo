module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "vue"],
  transform: {
    "^.+\\.vue$": "@vue/vue3-jest", // Handle Vue 3 files
    "^.+\\.(js|jsx|ts|tsx)$": "ts-jest", // Handle TypeScript and JavaScript
  },
  transformIgnorePatterns: ["/node_modules/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: [
    "**/tests/unit/**/*.spec.[jt]s?(x)", // existing test files in the tests folder
    "**/src/**/*.spec.[jt]s?(x)", // also look for tests inside the components folder
  ],
};
