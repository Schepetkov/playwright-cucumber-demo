import { Page } from '@playwright/test';
import BasePage from './basePage';

export default class HomePage extends BasePage {
  constructor(protected page: Page) {
    super(page);
  }

  async clickToCardByName(name: string) {
    const categoryCardsDiv = await this.page.waitForSelector(
      'div.category-cards',
    );
    const items = await categoryCardsDiv.$$('div');
    const filteredItems = await Promise.all(
      items.map(async (item) => {
        const itemName = await item.innerText();
        if (itemName === name) {
          return item;
        }
      }),
    );

    const filteredItem = filteredItems.find((item) => item !== undefined);
    if (filteredItem) {
      await filteredItem.click();
    }
  }
}
