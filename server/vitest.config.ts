import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts', 'src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/server.ts', 'src/**/*.d.ts'],
      thresholds: {
        lines: 80,
      },
    },
    testTimeout: 30000,
    hookTimeout: 60000,
    env: {
      NODE_ENV: 'test',
      MONGODB_URI: 'mongodb://localhost:27017/gathergrid_test',
      JWT_ACCESS_SECRET: 'test-access-secret-32-chars-length',
      JWT_REFRESH_SECRET: 'test-refresh-secret-32-chars-length',
      LOG_LEVEL: 'fatal',
    },
  },
});
