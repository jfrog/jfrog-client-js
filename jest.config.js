/**
 * Jest is the framework used for testing the client.
 * This is the Jest config file.
 */
module.exports = {
    preset: 'ts-jest',
    setupFiles: ['./test/TestUtils.ts'],
    testEnvironment: 'node',
    transform: {
        '^.+\\.ts$': 'ts-jest'
    },
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    testPathIgnorePatterns: ['/node_modules/', '/dist/', 'TestUtils'],
    testRegex: '(/test/.*|(\\.|/)(test|spec))\\.ts$',
    collectCoverage: true,
    coverageDirectory: 'coverage',
    collectCoverageFrom: ['src/**/*.ts', '!src/index.ts', '!*.d.ts'],
    testTimeout: '10000'
};
