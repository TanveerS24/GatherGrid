import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

export async function enableMocking() {
  if (import.meta.env.VITE_USE_MOCKS !== 'true' && !import.meta.env.DEV) {
    return;
  }
  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}
