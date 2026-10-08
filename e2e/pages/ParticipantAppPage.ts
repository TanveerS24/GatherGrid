import { Page, Locator } from '@playwright/test';

export class ParticipantAppPage {
  readonly page: Page;
  readonly exploreLink: Locator;
  readonly mapLink: Locator;
  readonly onlineLink: Locator;
  readonly myActivitiesLink: Locator;
  readonly loginButton: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.exploreLink = page.getByRole('link', { name: /explore/i });
    this.mapLink = page.getByRole('link', { name: /map/i });
    this.onlineLink = page.getByRole('link', { name: /online/i });
    this.myActivitiesLink = page.getByRole('link', { name: /my activities/i });
    this.loginButton = page.getByRole('button', { name: /log in/i });
    this.logoutButton = page.getByRole('button', { name: /log out/i });
  }

  async gotoHome() {
    await this.page.goto('/');
  }

  async gotoLogin() {
    await this.page.goto('/login');
  }

  async gotoRegister() {
    await this.page.goto('/register');
  }

  async gotoMyActivities() {
    await this.page.goto('/activities');
  }

  async gotoActivityDetail(id: string) {
    await this.page.goto(`/activities/${id}`);
  }

  async gotoTeams(activityId: string) {
    await this.page.goto(`/activities/${activityId}/teams`);
  }
}
