//const {defaults} = require('jest-config');
module.exports = {
  roots: ['<rootDir>'],
  testMatch: [
    "tests/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  // presets: [
  //   ['@babel/preset-env', {targets: {node: 'current'}}],
  //   '@babel/preset-typescript',
  // ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  //moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
  "moduleDirectories": [
    "node_modules",
    "src"
  ],
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "jsx"
  ],
  "verbose": true,
  "testURL": "http://localhost/"
} 