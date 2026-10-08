import { test, expect } from '@playwright/test';
import { setupMockApi, DEFAULT_ORGANIZER } from '../helpers/mockApi';
import { OrganizerAppPage } from '../pages/OrganizerAppPage';

test.describe('Journey 6: Activity Lifecycle (Cancel, Postpone, Repost)', () => {
  test('organizer views activities list and manages lifecycle status', async ({ page }) => {
    await setupMockApi(page, DEFAULT_ORGANIZER);
    const organizerApp = new OrganizerAppPage(page);

    await organizerApp.gotoDashboard();
    await page.goto('http://localhost:5174/activities');

    await expect(page.getByRole('heading', { level: 2, name: /My Activities/i })).toBeVisible();
    await expect(page.getByText('Sunset Beach Volleyball & Social')).toBeVisible();

    const manageBtn = page.getByRole('button', { name: /manage/i });
    await expect(manageBtn.first()).toBeVisible();
  });

  test.skip('postpone modal with consequence text and penalty-free opt out (@not-implemented in prototype UI)', async () => {
    // Documented in docs/testing/bugs-found.md as BUG-004: Postpone consequence dialog missing in web frontend
  });
});
