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
  coveragePathIgnorePatterns: ['./**/node_modules/'],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 80,
      statements: 80
    }
  }
};
