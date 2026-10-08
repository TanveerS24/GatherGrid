import { envSchema } from '@gathergrid/shared';
import type { EnvConfig } from '@gathergrid/shared';

/**
 * Validate and parse environment variables at boot time.
 * Throws a descriptive Zod error and crashes the process if any required variable is missing.
 */
function loadEnv(): EnvConfig {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const formatted = result.error.issues
      .map((issue) => `  • ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');

    console.error(`\n❌ Invalid environment variables:\n${formatted}\n`);
    process.exit(1);
  }

  return result.data;
}

export const env = loadEnv();
