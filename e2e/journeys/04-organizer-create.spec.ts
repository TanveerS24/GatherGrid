import { test, expect } from '@playwright/test';
import { setupMockApi, DEFAULT_ORGANIZER } from '../helpers/mockApi';
import { OrganizerAppPage } from '../pages/OrganizerAppPage';

test.describe('Journey 4: Organizer Activity Creation & Publishing', () => {
  test('organizer logs in, views dashboard, and accesses activity creation', async ({ page }) => {
    await setupMockApi(page, DEFAULT_ORGANIZER);
    const organizerApp = new OrganizerAppPage(page);

    await organizerApp.gotoDashboard();
    await expect(page.getByRole('heading', { level: 2, name: /Organizer Dashboard/i })).toBeVisible();

    // Verify presence of creation actions
    const createBtn = page.getByRole('link', { name: /create new activity/i });
    await expect(createBtn).toBeVisible();
    await createBtn.click();

    // Verify navigation to /activities/new
    await expect(page).toHaveURL(/.*activities\/new/);
  });
});
