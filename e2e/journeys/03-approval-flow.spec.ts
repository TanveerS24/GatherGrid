import { test, expect } from '@playwright/test';
import { setupMockApi, DEFAULT_ORGANIZER } from '../helpers/mockApi';
import { OrganizerAppPage } from '../pages/OrganizerAppPage';

test.describe('Journey 3: Host Approval Workflow', () => {
  test('organizer views participant roster and approves pending applicant', async ({ page }) => {
    await setupMockApi(page, DEFAULT_ORGANIZER);
    const organizerApp = new OrganizerAppPage(page);

    await organizerApp.gotoActivityParticipants('act-1');
    await expect(page.getByRole('heading', { level: 2, name: /Manage Participants/i })).toBeVisible();

    // Verify roster rendering
    await expect(page.getByText('Alex Rivera')).toBeVisible();
    await expect(page.getByText('Pending', { exact: true })).toBeVisible();

    // Click Approve button
    const approveBtn = page.getByRole('button', { name: /^approve$/i });
    await expect(approveBtn).toBeVisible();
    await approveBtn.click();

    // Confirm state changes to Confirmed
    await expect(page.getByText('Confirmed', { exact: true })).toBeVisible();
  });
});
