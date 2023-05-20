import { Page } from '@playwright/test';
import BasePage from './basePage';

export default class HomePage extends BasePage {
  constructor(protected page: Page) {
    super(page);
  }
  public PageElements = {
    categoryCardsDiv: 'div.category-cards',
  };

  async clickToCardByName(name: string) {
    const categoryCardsDiv = await this.page.waitForSelector(
      this.PageElements.categoryCardsDiv,
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
