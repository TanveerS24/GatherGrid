import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'admin-web',
    globals: true,
    environment: 'jsdom',
    setupFiles: ['../../packages/ui/src/test/setup.ts'],
    include: ['src/**/__tests__/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 65,
        statements: 70,
      },
    },
  },
});
