import { test, expect } from '@playwright/test';
import { setupMockApi, DEFAULT_PARTICIPANT } from '../helpers/mockApi';

test.describe('Journey 10: Cross-Role Isolation & Guard Security', () => {
  test('participant role cannot access organizer portal dashboard and is redirected to login', async ({ page }) => {
    await setupMockApi(page, DEFAULT_PARTICIPANT);

    await page.goto('http://localhost:5174/');
    // Should be redirected away or shown unauthorized / login
    await expect(page).toHaveURL(/.*login/);
  });

  test('participant role cannot access admin governance console and is redirected to login', async ({ page }) => {
    await setupMockApi(page, DEFAULT_PARTICIPANT);

    await page.goto('http://localhost:5175/');
    // Should be redirected away or shown unauthorized / login
    await expect(page).toHaveURL(/.*login/);
  });
});
