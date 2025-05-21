const { createDefaultPreset } = require('ts-jest');

const tsJestTransformCfg = createDefaultPreset({
    tsconfig: 'tsconfig.json',
}).transform;

/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',

    roots: ['<rootDir>/tests'],

    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

    testMatch: ['**/*.test.ts'],

    transform: {
        ...tsJestTransformCfg,
    },
};
