import { Page } from '@playwright/test';
import { testManager } from '../hooks/testManager';

export default class BasePage {
  buttonRole: 'button' = 'button';
  listitem: 'listitem' = 'listitem';
  domcontentloaded: 'domcontentloaded' = 'domcontentloaded';
  visibleState: 'visible' = 'visible';
  tableBodyRows: string = 'tbody tr';
  adPlusAnchorElement: string = '#adplus-anchor';
  private FooterHideCSSRule: string =
    'footer, footer span { display: none !important; }';

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

  async selectOptionByClass(classSelector: string, valueOption: string) {
    await this.page
      .locator(`select[class=${classSelector}]`)
      .selectOption(valueOption);
  }

  async hideFooter() {
    await testManager.page.addStyleTag({
      content: this.FooterHideCSSRule,
    });

    testManager.logger.info('HideFooter()');
  }

  async closeFooterAd() {
    await this.page.waitForSelector(this.adPlusAnchorElement);

    const footerAdId = this.adPlusAnchorElement;
    await this.page.evaluate((footerAdId: string) => {
      const parentElement = document.querySelector(footerAdId);
      if (parentElement) {
        parentElement.remove();
      }
    }, footerAdId);

    testManager.logger.info('CloseFooterAd()');
  }
}
