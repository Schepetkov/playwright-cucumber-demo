import { ElementHandle, Page } from '@playwright/test';
import BasePage from './basePage';

export default class ElementsPage extends BasePage {
  constructor(protected page: Page) {
    super(page);
  }

  public PageElements = {
    WebTables: 'Web Tables',
    FirstName: '#firstName',
    LastName: '#lastName',
    Age: '#age',
    Email: '#userEmail',
    Salary: '#salary',
    Department: '#department',
  };

  // TODO: use enum for types
  async clickToMenuListItemByName(name: string) {
    this.page
      .getByRole(this.listitem)
      .filter({ hasText: this.PageElements.WebTables })
      .click();
  }

  async GetLastCreatedDataInWebTables(): Promise<
    ElementHandle<SVGElement | HTMLElement>[]
  > {
    const tableDiv = await this.page.waitForSelector(
      'div.rt-table[role="grid"]',
    );

    // Find all <div class="rt-tr-group" role="rowgroup"> elements inside the table
    const rowGroupDivs = await tableDiv.$$('div.rt-tr-group[role="rowgroup"]');

    const filteredRowGroupDivs: ElementHandle[] = [];
    for (const rowGroupDiv of rowGroupDivs) {
      const tdElements = await rowGroupDiv.$$('div.rt-td');
      let isEmptyRow = false;

      for (const tdElement of tdElements) {
        const spanElement = await tdElement.$('span');
        const spanContent = await spanElement?.innerHTML();

        if (spanContent === '&nbsp;') {
          isEmptyRow = true;
          break;
        }
      }

      if (!isEmptyRow) {
        filteredRowGroupDivs.push(rowGroupDiv);
      }
    }

    const lastRowGroupDiv =
      filteredRowGroupDivs[filteredRowGroupDivs.length - 1];
    const cellElements = await lastRowGroupDiv.$$('div.rt-td');
    return cellElements;
  }
}
