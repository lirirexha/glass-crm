const nextJest = require('next/jest.js');

const createJestConfig = nextJest({
  dir: __dirname,
});

const config = {
  displayName: '@org/apps/web',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/web',
  testEnvironment: 'jsdom',

  testMatch: [
    '<rootDir>/src/**/*.spec.(ts|tsx|js|jsx)',
    '<rootDir>/src/**/*.test.(ts|tsx|js|jsx)',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/dist/',
    '/coverage/',
  ],
  watchPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/dist/',
    '/coverage/',
  ],
};

module.exports = createJestConfig(config);
