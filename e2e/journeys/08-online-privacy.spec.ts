import { test, expect } from '@playwright/test';
import { setupMockApi, DEFAULT_PARTICIPANT } from '../helpers/mockApi';

test.describe('Journey 8: Virtual Event Link Privacy & Access', () => {
  test('virtual events hub lists online events without leaking private meeting link upfront', async ({ page }) => {
    await setupMockApi(page, DEFAULT_PARTICIPANT);

    await page.route('**/api/v1/activities?format=online*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'ok',
          data: [
            {
              id: 'act-online-1',
              title: 'Remote React Architecture Workshop',
              categorySlug: 'tech',
              categoryLabel: 'Tech',
              status: 'published',
              isOnline: true,
              onlinePlatform: 'Zoom',
              shortDescription: 'Deep dive into full-stack architecture patterns.',
              registeredCount: 42,
              capacity: 100,
              startDateTime: '2026-10-30T17:00:00Z',
            },
          ],
        }),
      });
    });

    await page.goto('/online');
    await expect(page.getByRole('heading', { level: 1, name: /Join From Anywhere/i })).toBeVisible();
    await expect(page.getByText('Remote React Architecture Workshop')).toBeVisible();

    // Verify private zoom URL is not leaked in raw page
    const content = await page.content();
    expect(content).not.toContain('zoom.us/j/secret-meeting-id');
  });
});
