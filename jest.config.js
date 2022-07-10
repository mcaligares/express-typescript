module.exports = {
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
  testEnvironment: 'node',
  testRegex: './__tests__/.*\\.(test|spec)?\\.(ts|ts)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  rootDir: '.',
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    'controllers/(.*)': '<rootDir>/src/controllers/$1',
    'middlewares/(.*)': '<rootDir>/src/middlewares/$1',
    'repositories/(.*)': '<rootDir>/src/repositories/$1',
    'routes/(.*)': '<rootDir>/src/routes/$1',
    'services/(.*)': '<rootDir>/src/services/$1',
    'utils/(.*)': '<rootDir>/src/utils/$1'
  },
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 80,
      statements: 80
    }
  }
};
