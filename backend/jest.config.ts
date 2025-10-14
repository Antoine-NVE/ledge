// npx jest --init

import type { Config } from 'jest';

const config: Config = {
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',

    // Added by me
    preset: 'ts-jest',
    collectCoverageFrom: [
        './src/**/*.ts',
        '!./src/__tests__/**',
        '!./src/config/**',
        '!./src/errors/**',
        '!./src/routes/**',
        '!./src/types/**',
        '!./src/index.ts',
    ],
};

export default config;
