// npx jest --init

import type { Config } from 'jest';

const config: Config = {
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    preset: 'ts-jest', // Added by me
};

export default config;
