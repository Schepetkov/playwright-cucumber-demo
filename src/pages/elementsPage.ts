import { ElementHandle, Page } from '@playwright/test';
import BasePage from './basePage';
import { testManager } from '../hooks/playwright';

export default class ElementsPage extends BasePage {
  constructor(protected page: Page) {
    super(page);
  }

  public WebTablesInputFields = {
    FirstName: '#firstName',
    LastName: '#lastName',
    Age: '#age',
    Email: '#userEmail',
    Salary: '#salary',
    Department: '#department',
  };

  // TODO: move to base class
  async clickToMenuListItemByName(name: string) {
    this.page.getByRole(this.listitem).filter({ hasText: name }).click();
  }

  async GetTableGrid(): Promise<ElementHandle<SVGElement | HTMLElement>> {
    const tableGrid = await this.page.waitForSelector(
      'div.rt-table[role="grid"]',
    );

    return tableGrid;
  }

  // All rows with data inside
  async GetAllValidWebTablesRows(): Promise<
    ElementHandle<SVGElement | HTMLElement>[]
  > {
    const tableDiv = await this.GetTableGrid();

    // Find all <div class="rt-tr-group" role="rowgroup"> elements inside the table
    const rowGroupDivs = await tableDiv.$$('div.rt-tr-group[role="rowgroup"]');

    const filteredRowGroupDivs: ElementHandle<SVGElement | HTMLElement>[] = [];
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

    return filteredRowGroupDivs;
  }

  async GetWebTablesRowByFirstName(
    firstName: string,
  ): Promise<ElementHandle<SVGElement | HTMLElement>[]> {
    const filteredRowGroupDivs = await this.GetAllValidWebTablesRows();

    for (const row of filteredRowGroupDivs) {
      const cellElements = await row.$$('div.rt-td');
      for (const cellElement of cellElements) {
        const cellText = await cellElement.textContent();
        if (cellText.trim() !== '' && cellText.trim() === firstName) {
          return cellElements;
        }
      }
    }
  }

  async GetLastCreatedDataInWebTables(): Promise<
    ElementHandle<SVGElement | HTMLElement>[]
  > {
    const filteredRowGroupDivs = await this.GetAllValidWebTablesRows();
    const lastRowGroupDiv =
      filteredRowGroupDivs[filteredRowGroupDivs.length - 1];
    const cellElements = await lastRowGroupDiv.$$('div.rt-td');
    return cellElements;
  }
}
