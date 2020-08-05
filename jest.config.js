module.exports = {
  roots: [
    "<rootDir>/src",
    "<rootDir>/lib",
    "<rootDir>/client",
    "<rootDir>/api",
  ],
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
};