import {
  Given,
  Then,
  setDefaultTimeout,
  DataTable,
  World,
} from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { testManager } from '../../hooks/playwright';
import BasePage from '../../pages/basePage';
import HomePage from '../../pages/homePage';
import ElementsPage from '../../pages/elementsPage';

setDefaultTimeout(60 * 1000);

interface CustomWorld extends World {
  userInupt: {
    firstName?: string;
    lastName?: string;
    age?: string;
    email?: string;
    salary?: string;
    department?: string;
  };
}

Given('Go to url', async function () {
  const basePage = new BasePage(testManager.page);
  await basePage.goto('https://demoqa.com/');
  testManager.logger.info('I navigate to app');
});

Then('Navigate to {string}', async function (name: string) {
  const homePage = new HomePage(testManager.page);
  await homePage.clickToCardByName(name);
});

Then('Click on {string}', async function (elementName: string) {
  const elementsPage = new ElementsPage(testManager.page);
  await elementsPage.clickToMenuListItemByName(elementName);
});

Then('Click on {string} button', async function (buttonName: string) {
  const basePage = new BasePage(testManager.page);
  await basePage.clickToButtonByName(buttonName);
});

Then('Enter below inupt field', async function (dataTable: DataTable) {
  const data = dataTable.raw();
  const elementsPage = new ElementsPage(testManager.page);

  // Initialize this.userInupt if it's undefined
  if (!this.userInupt) {
    this.userInupt = {};
  }

  // Accessing data from the DataTable
  this.userInupt.firstName = data[1][0]; // First Name
  this.userInupt.lastName = data[1][1]; // Last Name
  this.userInupt.age = data[1][2]; // Age
  this.userInupt.email = data[1][3]; // Email
  this.userInupt.salary = data[1][4]; // Salary
  this.userInupt.department = data[1][5]; // Department

  await testManager.page.fill(
    elementsPage.PageElements.FirstName,
    this.userInupt.firstName,
  );
  await testManager.page.fill(
    elementsPage.PageElements.LastName,
    this.userInupt.lastName,
  );
  await testManager.page.fill(
    elementsPage.PageElements.Age,
    this.userInupt.age,
  );
  await testManager.page.fill(
    elementsPage.PageElements.Email,
    this.userInupt.email,
  );
  await testManager.page.fill(
    elementsPage.PageElements.Salary,
    this.userInupt.salary,
  );
  await testManager.page.fill(
    elementsPage.PageElements.Department,
    this.userInupt.department,
  );
});

Then('Validate user data in web table', async function () {
  const elementsPage = new ElementsPage(testManager.page);
  const cellElements = await elementsPage.GetLastCreatedDataInWebTables();

  let cellsTest = [];
  for (const cellElement of cellElements) {
    const cellText = await cellElement.textContent();
    if (cellText.trim() !== '') {
      testManager.logger.info(cellText.trim());
      cellsTest.push(cellText.trim());
    }
  }

  expect(cellsTest.length).toBe(6);
  expect(cellsTest[0]).toContain(this.userInupt.firstName);
  expect(cellsTest[1]).toContain(this.userInupt.lastName);
  expect(cellsTest[2]).toContain(this.userInupt.age);
  expect(cellsTest[3]).toContain(this.userInupt.email);
  expect(cellsTest[4]).toContain(this.userInupt.salary);
  expect(cellsTest[5]).toContain(this.userInupt.department);
});
