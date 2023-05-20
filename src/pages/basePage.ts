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

  async GetDateName(value: number) {
    const dataList = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];
    return dataList[value];
  }

  async GetMonthName(value: number) {
    const dataList = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November ',
      'December',
    ];
    return dataList[value];
  }

  async GetDayPrefix(value: number) {
    if (value === 1 || value === 31) {
      return 'st';
    } else if (value === 2 || value === 22) {
      return 'nd';
    } else if (value === 21) {
      return 'st';
    } else if (value === 23) {
      return 'rd';
    } else {
      return value === 3 ? 'rd' : 'th';
    }
  }

  async ChooseCurrentDateDatepickerWithCustomYear(year: string) {
    const d = new Date();
    const day = await this.GetDateName(d.getDate() - 1);
    const month = await this.GetMonthName(d.getMonth());
    const dayPreFix = await this.GetDayPrefix(d.getDate());
    const buttonName = `Choose ${day}, ${month} ${d.getDate()}${dayPreFix}, ${year}`;
    await this.page.getByRole('button', { name: buttonName }).click();
  }
}
