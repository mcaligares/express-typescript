module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: [ 'ts', 'js' ],
  testMatch: ['**/__tests__/**/*.test.[jt]s'],
  testPathIgnorePatterns: ['dist/', 'node_modules/', 'src/']
};