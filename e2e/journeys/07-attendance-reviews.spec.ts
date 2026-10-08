import { test, expect } from '@playwright/test';
import { setupMockApi, DEFAULT_ORGANIZER, DEFAULT_PARTICIPANT } from '../helpers/mockApi';

test.describe('Journey 7: Attendance Check-in & Review Eligibility', () => {
  test('organizer views check-in roster for completed event', async ({ page }) => {
    await setupMockApi(page, DEFAULT_ORGANIZER);

    await page.goto('http://localhost:5174/activities/act-1/participants');
    await expect(page.getByRole('heading', { level: 2, name: /Manage Participants/i })).toBeVisible();
    await expect(page.getByText('Alex Rivera')).toBeVisible();
  });

  test('participant navigates to organizer public profile with badge and rating', async ({ page }) => {
    await setupMockApi(page, DEFAULT_PARTICIPANT);

    await page.goto('/organizers/org-1');
    await expect(page.getByRole('heading', { level: 1, name: /Bay Area Outdoor Club/i })).toBeVisible();
    await expect(page.getByText(/4\.8/)).toBeVisible();
    await expect(page.getByText(/gold organizer/i)).toBeVisible();
  });
});
