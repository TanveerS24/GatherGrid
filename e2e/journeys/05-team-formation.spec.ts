import { test, expect } from '@playwright/test';
import { setupMockApi, DEFAULT_PARTICIPANT } from '../helpers/mockApi';
import { ParticipantAppPage } from '../pages/ParticipantAppPage';

test.describe('Journey 5: Team Formation & Join Code Flow', () => {
  test('participant creates a team, views join code, and handles team actions', async ({ page }) => {
    await setupMockApi(page, DEFAULT_PARTICIPANT);
    const participantApp = new ParticipantAppPage(page);

    await participantApp.gotoTeams('act-2');
    await expect(page.getByRole('heading', { level: 2, name: /Form & Join Teams/i })).toBeVisible();

    // Verify existing team or team creation card
    await expect(page.getByText('Create a Team')).toBeVisible();

    // Fill in team name
    const teamNameInput = page.getByPlaceholder(/e\.g\. Code Warriors/i);
    await teamNameInput.fill('Cyber Hawks');

    const createTeamBtn = page.getByRole('button', { name: /create team/i });
    await createTeamBtn.click();

    // Verify created team card appears
    await expect(page.getByText('Cyber Hawks')).toBeVisible();
    await expect(page.getByText(/join code:/i)).toBeVisible();
  });
});
