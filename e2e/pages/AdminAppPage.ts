import { Page, Locator } from '@playwright/test';

export class AdminAppPage {
  readonly page: Page;
  readonly usersLink: Locator;
  readonly activitiesLink: Locator;
  readonly reportsLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usersLink = page.getByRole('link', { name: /users/i });
    this.activitiesLink = page.getByRole('link', { name: /activities/i });
    this.reportsLink = page.getByRole('link', { name: /reports/i });
  }

  async gotoDashboard() {
    await this.page.goto('http://localhost:5175/');
  }

  async gotoLogin() {
    await this.page.goto('http://localhost:5175/login');
  }

  async gotoUsers() {
    await this.page.goto('http://localhost:5175/users');
  }

  async gotoReports() {
    await this.page.goto('http://localhost:5175/reports');
  }
}
