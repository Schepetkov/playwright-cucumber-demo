import { ElementHandle, Page } from '@playwright/test';
import BasePage from './basePage';
import { testManager } from '../hooks/playwright';

export default class ElementsPage extends BasePage {
  constructor(protected page: Page) {
    super(page);
  }

  public PageElements = {
    FirstNameInput: '#firstName',
    LastNameInput: '#lastName',
    AgeInput: '#age',
    EmailInput: '#userEmail',
    SalaryInput: '#salary',
    DepartmentInput: '#department',
    GridTableDiv: 'div.rt-table[role="grid"]',
    RowGroupDiv: 'div.rt-tr-group[role="rowgroup"]',
    TableCellDiv: 'div.rt-td',
    RowsWithNonBreakingSpace: '&nbsp;',
    BrokenImageElement: 'img[src="/images/Toolsqa_1.jpg"]',
  };

  // TODO: move to base class
  async clickToMenuListItemByName(name: string) {
    this.page.getByRole(this.listitem).filter({ hasText: name }).click();
  }

  async GetTableGrid(): Promise<ElementHandle<SVGElement | HTMLElement>> {
    const tableGrid = await this.page.waitForSelector(
      this.PageElements.GridTableDiv,
    );

    return tableGrid;
  }

  // All rows with data inside
  async GetAllValidWebTablesRows(): Promise<
    ElementHandle<SVGElement | HTMLElement>[]
  > {
    const tableDiv = await this.GetTableGrid();
    const rowGroupDivs = await tableDiv.$$(this.PageElements.RowGroupDiv);

    const filteredRowGroupDivs: ElementHandle<SVGElement | HTMLElement>[] = [];
    for (const rowGroupDiv of rowGroupDivs) {
      const tdElements = await rowGroupDiv.$$(this.PageElements.TableCellDiv);
      let isEmptyRow = false;

      for (const tdElement of tdElements) {
        const spanElement = await tdElement.$('span');
        const spanContent = await spanElement?.innerHTML();

        if (spanContent === this.PageElements.RowsWithNonBreakingSpace) {
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
      const cellElements = await row.$$(this.PageElements.TableCellDiv);
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
    const cellElements = await lastRowGroupDiv.$$(
      this.PageElements.TableCellDiv,
    );
    return cellElements;
  }
}
