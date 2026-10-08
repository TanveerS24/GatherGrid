/// <reference types="vite/client" />
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

export async function enableMocking() {
  const env = (import.meta as unknown as { env?: Record<string, string | boolean | undefined> }).env;
  if (env?.VITE_USE_MOCKS !== 'true' && !env?.DEV) {
    return;
  }
  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}

