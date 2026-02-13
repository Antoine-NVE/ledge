// npx jest --init

import type { Config } from 'jest';

const config: Config = {
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',

    // Added by me
    preset: 'ts-jest',
    collectCoverageFrom: ['./src/**/*.ts'],
};

export default config;
