import { Page } from '@playwright/test';

export default class BasePage {
  buttonRole: 'button' = 'button';
  listitem: 'listitem' = 'listitem';
  domcontentloaded: 'domcontentloaded' = 'domcontentloaded';
  visibleState: 'visible' = 'visible';

  constructor(protected page: Page) {
    this.page = page;
  }

  async clickToButtonByName(buttonName: string) {
    await this.page
      .getByRole(this.buttonRole, { name: buttonName, exact: true })
      .click();
  }

  async goto(url: string) {
    await this.page.goto(url, {
      waitUntil: this.domcontentloaded,
    });
  }

  async waitAndClick(locator: string) {
    const element = this.page.locator(locator);
    await element.waitFor({
      state: this.visibleState,
    });
    await element.click();
  }

  async navigateTo(link: string) {
    await Promise.all([this.page.waitForNavigation(), this.page.click(link)]);
  }
}
