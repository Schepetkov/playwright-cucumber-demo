import {
  Given,
  Then,
  setDefaultTimeout,
  DataTable,
  World,
} from '@cucumber/cucumber';
import { ElementHandle, expect, request } from '@playwright/test';
import { testManager } from '../../hooks/playwright';
import BasePage from '../../pages/basePage';
import HomePage from '../../pages/homePage';
import ElementsPage from '../../pages/elementsPage';
import FormsPage from '../../pages/formsPage';

setDefaultTimeout(60 * 1000);

interface CustomWorld extends World {
  webTablesInputFields: {
    firstName?: string;
    lastName?: string;
    age?: string;
    email?: string;
    salary?: string;
    department?: string;
    curentRow?: Promise<ElementHandle<SVGElement | HTMLElement>[]>;
  };

  practiceFormInputFields: {
    data?: { [key: string]: string };
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

  // First Name
  if (data[1][0]) {
    this.userInupt.firstName = data[1][0];
    await testManager.page.fill(
      elementsPage.PageElements.FirstNameInput,
      this.userInupt.firstName,
    );
  }

  // Last Name
  if (data[1][1]) {
    this.userInupt.lastName = data[1][1];
    await testManager.page.fill(
      elementsPage.PageElements.LastNameInput,
      this.userInupt.lastName,
    );
  }

  // Age
  if (data[1][2]) {
    this.userInupt.age = data[1][2];
    await testManager.page.fill(
      elementsPage.PageElements.AgeInput,
      this.userInupt.age,
    );
  }

  // Email
  if (data[1][3]) {
    this.userInupt.email = data[1][3];
    await testManager.page.fill(
      elementsPage.PageElements.EmailInput,
      this.userInupt.email,
    );
  }

  // Salary
  if (data[1][4]) {
    this.userInupt.salary = data[1][4];
    await testManager.page.fill(
      elementsPage.PageElements.SalaryInput,
      this.userInupt.salary,
    );
  }

  // Department
  if (data[1][5]) {
    this.userInupt.department = data[1][5];
    await testManager.page.fill(
      elementsPage.PageElements.DepartmentInput,
      this.userInupt.department,
    );
  }
});

Then('Validate user data in web table', async function () {
  const elementsPage = new ElementsPage(testManager.page);
  const cellElements = await elementsPage.GetLastCreatedDataInWebTables();

  //const cellsTest = elementsPage.extractNonEmptyCellTexts(cellElements);
  // TODO: move to separate function
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

Then(
  'Click on edit icon in the row of the web table that contains firsname {string}',
  async function (firsName: string) {
    const elementsPage = new ElementsPage(testManager.page);

    // Initialize this.userInupt if it's undefined
    if (!this.userInupt) {
      this.userInupt = {};
    }

    this.userInupt.curentRow = await elementsPage.GetWebTablesRowByFirstName(
      firsName,
    );
    for (const cellElement of this.userInupt.curentRow) {
      const editButton = await cellElement.$('span[title="Edit"]');
      if (editButton) {
        await editButton.click();
        break;
      }
    }
  },
);

Then('Validate changed user data in web table', async function () {
  const elementsPage = new ElementsPage(testManager.page);

  // TODO: move to separate function
  let cellsTest = [];
  for (const cellElement of this.userInupt.curentRow) {
    const cellText = await cellElement.textContent();
    if (cellText.trim() !== '') {
      testManager.logger.info(cellText.trim());
      cellsTest.push(cellText.trim());
    }
  }

  expect(cellsTest.length).toBe(6);
  expect(cellsTest[0]).toContain(this.userInupt.firstName);
  expect(cellsTest[1]).toContain(this.userInupt.lastName);
});

Then('Validate image is not broken', async function () {
  const elementsPage = new ElementsPage(testManager.page);

  const imageElement = await testManager.page.$(
    elementsPage.PageElements.BrokenImageElement,
  );
  if (!imageElement) {
    testManager.logger.info('Image failed to load');
    throw new Error('Image failed to load!');
  }
});

Then('Validate data is practice form', async function () {
  testManager.logger.info('invoke: Validate data is practice form');
  const formsPage = new FormsPage(testManager.page);
  const practiceFormData = await formsPage.collectPracticeFormTableFilledData();

  for (const key in practiceFormData) {
    const value = practiceFormData[key];

    testManager.logger.info(
      `Then Validate data is practice form: - ${this.practiceFormInputFields.data[key]} == ${value}`,
    );

    expect(this.practiceFormInputFields.data[key]).toBe(value);
  }
});

Then('Enter data in practice form', async function (dataTable: DataTable) {
  const data = dataTable.raw();
  const formsPage = new FormsPage(testManager.page);

  // Initialize this.userInupt if it's undefined
  if (!this.practiceFormInputFields) {
    this.practiceFormInputFields = {
      data: {},
    };
  }

  {
    // It can be in a different place, bugs on website
    try {
      await formsPage.closeFooterAd();
    } catch {}

    await formsPage.hideFooter();
    await formsPage.uploadPicture();

    // Save Image for next validation
    this.practiceFormInputFields.data[
      formsPage.TableResponsiveElements.Picture
    ] = formsPage.PageElements.ImagePathName;
  }

  const firstName = data[1][0];
  if (firstName) {
    await testManager.page.fill(
      formsPage.PageElements.FirstNameInput,
      firstName,
    );
    testManager.logger.info(
      `fill: ${firstName} in ${formsPage.PageElements.FirstNameInput}`,
    );
  }

  const lastName = data[1][1];
  if (lastName) {
    await testManager.page.fill(formsPage.PageElements.LastNameInput, lastName);
    testManager.logger.info(
      `fill: ${lastName} in ${formsPage.PageElements.LastNameInput}`,
    );
  }

  // Save student name for next validation
  this.practiceFormInputFields.data[
    formsPage.TableResponsiveElements.StudentName
  ] = `${firstName} ${lastName}`;

  const email = data[1][2];
  if (email) {
    this.practiceFormInputFields.data[
      formsPage.TableResponsiveElements.StudentEmail
    ] = email;
    await testManager.page.fill(formsPage.PageElements.EmailInput, email);
    testManager.logger.info(
      `fill: ${email} in ${formsPage.PageElements.EmailInput}`,
    );
  }

  const gender = data[1][3];
  if (gender) {
    this.practiceFormInputFields.data[
      formsPage.TableResponsiveElements.Gender
    ] = gender;
    await testManager.page
      .getByText(gender, {
        exact: true,
      })
      .click();
    testManager.logger.info(
      `picked: ${gender} in ${formsPage.TableResponsiveElements.Gender}`,
    );
  }

  const mobile = data[1][4];
  if (mobile) {
    this.practiceFormInputFields.data[
      formsPage.TableResponsiveElements.MobileNumber
    ] = mobile;
    await testManager.page.fill(
      formsPage.PageElements.MobileNumberInput,
      mobile,
    );
    testManager.logger.info(
      `fill: ${mobile} in ${formsPage.PageElements.MobileNumberInput}`,
    );
  }

  const dateOfBirth = data[1][5];
  const mounOfBirth = data[1][6];
  const yearOfBirth = data[1][7];
  const birthData = `${dateOfBirth} ${mounOfBirth},${yearOfBirth}`;

  if (dateOfBirth && mounOfBirth && yearOfBirth) {
    this.practiceFormInputFields.data[
      formsPage.TableResponsiveElements.DateOfBirth
    ] = birthData;

    await formsPage.waitAndClick(formsPage.PageElements.DateOfBirthInput);

    await formsPage.selectOptionByClass(
      formsPage.PageElements.DatepickerMonthSelectClass,
      mounOfBirth,
    );

    await formsPage.selectOptionByClass(
      formsPage.PageElements.DatepickerYearSelectClass,
      yearOfBirth,
    );

    await formsPage.waitAndClick(
      `${formsPage.PageElements.DatepickerDaySelectLocator}${dateOfBirth}`,
    );

    testManager.logger.info(`choose: ${birthData} in datepicker`);
  }

  const subjects = data[1][8];
  if (subjects) {
    this.practiceFormInputFields.data[
      formsPage.TableResponsiveElements.Subjects
    ] = subjects;
    await testManager.page.fill(formsPage.PageElements.SubjectsInput, subjects);
    testManager.logger.info(
      `fill: ${subjects} in ${formsPage.PageElements.SubjectsInput}`,
    );
    await testManager.page.keyboard.press('Tab');
  }

  const hobbies = data[1][9];
  if (hobbies) {
    this.practiceFormInputFields.data[
      formsPage.TableResponsiveElements.Hobbies
    ] = hobbies;

    await testManager.page.getByText(hobbies).click();
    testManager.logger.info(
      `picked: ${hobbies} in ${formsPage.TableResponsiveElements.Hobbies}`,
    );
  }

  const currentAddress = data[1][10];
  if (currentAddress) {
    this.practiceFormInputFields.data[
      formsPage.TableResponsiveElements.Address
    ] = currentAddress;

    await testManager.page.fill(
      formsPage.PageElements.CurrentAddressInput,
      currentAddress,
    );
    testManager.logger.info(
      `fill: ${currentAddress} in ${formsPage.PageElements.CurrentAddressInput}`,
    );
  }

  const state = data[1][11];
  if (state) {
    await formsPage.waitAndClick(formsPage.PageElements.StateInput);
    await testManager.page
      .getByText(state, {
        exact: true,
      })
      .click();

    testManager.logger.info(
      `choose: ${state} in ${formsPage.PageElements.StateInput}}`,
    );
  }

  const city = data[1][12];
  if (city) {
    await formsPage.waitAndClick(formsPage.PageElements.CityInput);

    await testManager.page.getByText(city, { exact: true }).click();
  }

  this.practiceFormInputFields.data[
    formsPage.TableResponsiveElements.StateAndCity
  ] = `${state} ${city}`;

  const parentSelector =
    formsPage.PageElements.SubmitButtonFooterOverlayLocator;
  const submitId = formsPage.PageElements.SubmitButton;
  // Evaluate JavaScript to click the button
  await testManager.page.evaluate((parentSelector) => {
    const parentElement = document.querySelector(parentSelector);
    const button = parentElement.querySelector('#submit');
    button.dispatchEvent(new MouseEvent('click'));
  }, parentSelector);

  testManager.logger.info(`pressed: ${submitId} button`);
});
