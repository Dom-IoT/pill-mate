/**
 * @type {import('ts-jest').JestConfigWithTsJest}
 */
module.exports = {
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules', '/build'],
    transform: {
        '.ts$': ['ts-jest', {}],
    },
};
