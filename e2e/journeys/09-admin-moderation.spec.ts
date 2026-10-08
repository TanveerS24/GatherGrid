import { test, expect } from '@playwright/test';
import { setupMockApi, DEFAULT_ADMIN } from '../helpers/mockApi';
import { AdminAppPage } from '../pages/AdminAppPage';

test.describe('Journey 9: Admin Content Moderation & Reports Queue', () => {
  test('admin logs in, views reports queue, and resolves flagged reports', async ({ page }) => {
    await setupMockApi(page, DEFAULT_ADMIN);
    const adminApp = new AdminAppPage(page);

    await adminApp.gotoReports();
    await expect(page.getByRole('heading', { level: 2, name: /Reports Queue/i })).toBeVisible();

    // Verify report list displays
    await expect(page.getByText('Crypto Trading Meetup')).toBeVisible();

    // Resolve report action
    const resolveBtn = page.getByRole('button', { name: /dismiss \/ resolve/i });
    await expect(resolveBtn.first()).toBeVisible();
    await resolveBtn.first().click();

    await expect(page.getByText('Report resolved and marked.')).toBeVisible();
  });
});
