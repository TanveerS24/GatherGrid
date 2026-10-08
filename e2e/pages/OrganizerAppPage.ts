import { Page, Locator } from '@playwright/test';

export class OrganizerAppPage {
  readonly page: Page;
  readonly activitiesLink: Locator;
  readonly newActivityButton: Locator;
  readonly participantsLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.activitiesLink = page.getByRole('link', { name: /activities/i });
    this.newActivityButton = page.getByRole('button', { name: /create activity|new activity/i });
    this.participantsLink = page.getByRole('link', { name: /participants/i });
  }

  async gotoDashboard() {
    await this.page.goto('http://localhost:5174/');
  }

  async gotoLogin() {
    await this.page.goto('http://localhost:5174/login');
  }

  async gotoNewActivity() {
    await this.page.goto('http://localhost:5174/activities/new');
  }

  async gotoActivityParticipants(activityId: string) {
    await this.page.goto(`http://localhost:5174/activities/${activityId}/participants`);
  }
}
