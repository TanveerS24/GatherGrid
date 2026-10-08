import { test, expect } from '@playwright/test';
import { setupMockApi, DEFAULT_PARTICIPANT } from '../helpers/mockApi';

test.describe('Journey 11: Mobile Viewport Responsive Experience', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('participant mobile layout renders bottom navigation and allows switching views', async ({ page }) => {
    await setupMockApi(page, DEFAULT_PARTICIPANT);

    await page.goto('/');
    await expect(page).toHaveURL('/');

    // Bottom navigation should be visible on mobile viewport
    const bottomNav = page.locator('nav').filter({ hasText: /explore/i });
    await expect(bottomNav).toBeVisible();

    // Navigate to My Activities tab via bottom nav
    const myEventsTab = page.getByRole('button', { name: /my events/i });
    if (await myEventsTab.isVisible()) {
      await myEventsTab.click();
      await expect(page).toHaveURL(/.*activities/);
    }
  });
});
