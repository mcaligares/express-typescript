module.exports = {
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
  testEnvironment: 'node',
  testRegex: './__tests__/.*\\.(test|spec)?\\.(ts|ts)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  rootDir: '.',
  roots: ['<rootDir>/src', '<rootDir>/__tests__'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '.js',
    './node_modules/',
    './src/services/logger.service.ts',
    './src/repositories/user.repository.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75
    }
  },
  moduleNameMapper: {
    '@/endpoints/(.*)': '<rootDir>/src/endpoints/$1',
    '@/models/(.*)': '<rootDir>/src/models/$1',
    '@/middlewares/(.*)': '<rootDir>/src/middlewares/$1',
    '@/repositories/(.*)': '<rootDir>/src/repositories/$1',
    '@/routes/(.*)': '<rootDir>/src/routes/$1',
    '@/services/(.*)': '<rootDir>/src/services/$1',
    '@/utils/(.*)': '<rootDir>/src/utils/$1',
    '@/(.*)': '<rootDir>/src/$1'
  }
};
