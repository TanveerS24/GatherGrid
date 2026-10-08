import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'server',
    globals: true,
    environment: 'node',
    include: ['src/**/__tests__/**/*.test.ts'],
    testTimeout: 60000,
    hookTimeout: 60000,
    env: {
      NODE_ENV: 'test',
      MONGODB_URI: 'mongodb://localhost:27017/test_gathergrid',
      JWT_ACCESS_SECRET: 'test-jwt-access-secret-key-32chars-min!!',
      JWT_REFRESH_SECRET: 'test-jwt-refresh-secret-key-32chars-min!!',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 80,
        functions: 75,
        branches: 70,
        statements: 80,
      },
    },
  },
});
