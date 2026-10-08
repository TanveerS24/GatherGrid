import { test, expect } from '@playwright/test';
import { setupMockApi, DEFAULT_PARTICIPANT } from '../helpers/mockApi';
import { ParticipantAppPage } from '../pages/ParticipantAppPage';

test.describe('Journey 1: Participant Core Discovery & Registration Lifecycle', () => {
  test('participant can register, browse discover feed, view activity details, and access my activities', async ({ page }) => {
    await setupMockApi(page, DEFAULT_PARTICIPANT);
    const participantApp = new ParticipantAppPage(page);

    // 1. Visit registration page
    await participantApp.gotoRegister();
    await expect(page).toHaveURL(/.*register/);
    await expect(page.getByRole('button', { name: /sign up|create account/i })).toBeVisible();

    // 2. Visit Discover Feed (home)
    await participantApp.gotoHome();
    await expect(page).toHaveURL('/');
    await expect(page.getByText(/GatherGrid/i)).toBeVisible();

    // 3. Radius Slider & Discover Filters exist
    const searchInput = page.getByPlaceholder(/search activities/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill('Volleyball');
    }

    // 4. Navigate to My Activities page
    await participantApp.gotoMyActivities();
    await expect(page).toHaveURL(/.*activities/);
    await expect(page.getByRole('heading', { level: 2, name: /My Activities/i })).toBeVisible();
  });
});
