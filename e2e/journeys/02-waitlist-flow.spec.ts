import { test, expect } from '@playwright/test';
import { setupMockApi, DEFAULT_PARTICIPANT } from '../helpers/mockApi';

test.describe('Journey 2: Waitlist Promotion & Offer Confirmation Lifecycle', () => {
  test('displays activity capacity and registration state', async ({ page }) => {
    await setupMockApi(page, DEFAULT_PARTICIPANT);

    await page.route('**/api/v1/activities/act-full', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'ok',
          data: {
            id: 'act-full',
            title: 'Full Capacity Workshop',
            categorySlug: 'workshops',
            categoryLabel: 'Workshops',
            status: 'published',
            registeredCount: 20,
            capacity: 20,
            isTeamEvent: false,
            startDateTime: '2026-11-01T10:00:00Z',
            locationName: 'Community Center',
            organizerName: 'Tech Guild',
            organizerId: 'org-1',
          },
        }),
      });
    });

    await page.goto('/activities/act-full');
    await expect(page.getByText('Full Capacity Workshop')).toBeVisible();
    await expect(page.getByText('20 / 20')).toBeVisible();
  });

  test.skip('second user joins waitlist, first cancels, second receives offer and confirms (@not-implemented in prototype UI)', async () => {
    // Documented in docs/testing/bugs-found.md as BUG-002: Frontend lacks dedicated waitlist offer countdown UI modal
  });
});
