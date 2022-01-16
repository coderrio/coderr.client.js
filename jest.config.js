module.exports = {
  roots: ['<rootDir>'],
  testMatch: [
    "tests/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  "verbose": true,
  "testURL": "http://localhost/"
} 