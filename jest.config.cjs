/**
 * Jest Configuration for CryptoDuels
 * Configured for Vite + React with ESM and TypeScript support
 */
module.exports = {
    // Test environment
    testEnvironment: 'jsdom',
    preset: 'ts-jest/presets/js-with-ts',
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
    extensionsToTreatAsEsm: ['.ts', '.tsx'],

    // Setup files to run after jest is initialized
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],

    // Module name mapper for CSS and static assets
    moduleNameMapper: {
        // Handle CSS imports (with CSS Modules)
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',

        // Handle image imports
        '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/__mocks__/fileMock.js',

        // Auto-mock framer-motion
        '^framer-motion$': '<rootDir>/src/__mocks__/framer-motion.js',

        // Auto-mock lucide-react
        '^lucide-react$': '<rootDir>/src/__mocks__/lucide-react.js',

        // Path aliases (match tsconfig.json)
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@components/(.*)$': '<rootDir>/src/components/$1',
        '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
        '^@utils/(.*)$': '<rootDir>/src/utils/$1',
        '^@games/(.*)$': '<rootDir>/src/games/$1',
        '^@constants/(.*)$': '<rootDir>/src/constants/$1'
    },

    // Transform files with Babel (JS/JSX) and ts-jest (TS/TSX)
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest',
        '^.+\\.(ts|tsx)$': 'ts-jest'
    },

    // Which files to ignore during transformation
    transformIgnorePatterns: [
        'node_modules/(?!(framer-motion)/)'
    ],

    // Test file patterns - include TypeScript
    testMatch: [
        '<rootDir>/src/**/*.test.{js,jsx,ts,tsx}',
        '<rootDir>/src/**/*.spec.{js,jsx,ts,tsx}'
    ],

    // Module file extensions - add TypeScript
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

    // Collect coverage from these files - include TypeScript
    collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx}',
        '!src/main.jsx',
        '!src/**/*.test.{js,jsx,ts,tsx}',
        '!src/__mocks__/**'
    ],

    // Coverage thresholds (strict for production quality)
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100
        }
    },

    // Verbose output
    verbose: true
};

