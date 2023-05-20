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

  //await testManager.page.route('**/', (request) => {
  // return request.request().resourceType() === 'image'
  // ? request.abort()
  //: request.continue();
  //});
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
      elementsPage.WebTablesInputFields.FirstName,
      this.userInupt.firstName,
    );
  }

  // Last Name
  if (data[1][1]) {
    this.userInupt.lastName = data[1][1];
    await testManager.page.fill(
      elementsPage.WebTablesInputFields.LastName,
      this.userInupt.lastName,
    );
  }

  // Age
  if (data[1][2]) {
    this.userInupt.age = data[1][2];
    await testManager.page.fill(
      elementsPage.WebTablesInputFields.Age,
      this.userInupt.age,
    );
  }

  // Email
  if (data[1][3]) {
    this.userInupt.email = data[1][3];
    await testManager.page.fill(
      elementsPage.WebTablesInputFields.Email,
      this.userInupt.email,
    );
  }

  // Salary
  if (data[1][4]) {
    this.userInupt.salary = data[1][4];
    await testManager.page.fill(
      elementsPage.WebTablesInputFields.Salary,
      this.userInupt.salary,
    );
  }

  // Department
  if (data[1][5]) {
    this.userInupt.department = data[1][5];
    await testManager.page.fill(
      elementsPage.WebTablesInputFields.Department,
      this.userInupt.department,
    );
  }
});

Then('Validate user data in web table', async function () {
  const elementsPage = new ElementsPage(testManager.page);
  const cellElements = await elementsPage.GetLastCreatedDataInWebTables();

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
  const imageElement = await testManager.page.$(
    'img[src="/images/Toolsqa_1.jpg"]',
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

  //TODO: Refactoring
  {
    // Wait for the parent element to appear on the page
    await testManager.page.waitForSelector('#adplus-anchor');
    await testManager.page.evaluate(() => {
      const parentElement = document.querySelector('#adplus-anchor');
      if (parentElement) {
        parentElement.remove();
      }
    });

    // hide footer
    await testManager.page.addStyleTag({
      content: 'footer, footer span { display: none !important; }',
    });

    //uploadPicture
    await testManager.page.waitForSelector('#uploadPicture'); // Wait for the file input element to be available
    const fileInput = await testManager.page.$('#uploadPicture');
    await fileInput.setInputFiles('Toolsqa.jpg');

    this.practiceFormInputFields.data[
      formsPage.AutomationPracticeFormInputFieldNames.Picture
    ] = 'Toolsqa.jpg';
  }

  const FirstName = data[1][0];
  if (FirstName) {
    await testManager.page.fill(
      formsPage.AutomationPracticeFormElements.FirstName,
      FirstName,
    );
    testManager.logger.info(
      `fill: ${FirstName} in ${formsPage.AutomationPracticeFormElements.FirstName}`,
    );
  }

  const LastName = data[1][1];
  if (LastName) {
    await testManager.page.fill(
      formsPage.AutomationPracticeFormElements.LastName,
      LastName,
    );
    testManager.logger.info(
      `fill: ${LastName} in ${formsPage.AutomationPracticeFormElements.LastName}`,
    );
  }

  this.practiceFormInputFields.data[
    formsPage.AutomationPracticeFormInputFieldNames.StudentName
  ] = `${FirstName} ${LastName}`;

  const Email = data[1][2];
  if (Email) {
    this.practiceFormInputFields.data[
      formsPage.AutomationPracticeFormInputFieldNames.StudentEmail
    ] = Email;
    await testManager.page.fill(
      formsPage.AutomationPracticeFormElements.Email,
      Email,
    );
    testManager.logger.info(
      `fill: ${Email} in ${formsPage.AutomationPracticeFormElements.Email}`,
    );
  }

  const Gender = data[1][3];
  if (Gender) {
    this.practiceFormInputFields.data[
      formsPage.AutomationPracticeFormInputFieldNames.Gender
    ] = Gender;
    await testManager.page
      .getByText(Gender, {
        exact: true,
      })
      .click();
    testManager.logger.info(
      `Picked: ${Gender} in ${formsPage.AutomationPracticeFormInputFieldNames.Gender}`,
    );
  }

  const Mobile = data[1][4];
  if (Mobile) {
    this.practiceFormInputFields.data[
      formsPage.AutomationPracticeFormInputFieldNames.MobileNumber
    ] = Mobile;
    await testManager.page.fill(
      formsPage.AutomationPracticeFormElements.MobileNumber,
      Mobile,
    );
    testManager.logger.info(
      `fill: ${Mobile} in ${formsPage.AutomationPracticeFormElements.MobileNumber}`,
    );
  }

  const DateOfBirth = data[1][5];
  const MounOfBirth = data[1][6];
  const YearOfBirth = data[1][7];
  const BirthData = `${DateOfBirth} ${MounOfBirth},${YearOfBirth}`;
  if (DateOfBirth && MounOfBirth && YearOfBirth) {
    this.practiceFormInputFields.data[
      formsPage.AutomationPracticeFormInputFieldNames.DateOfBirth
    ] = BirthData;

    await formsPage.waitAndClick(
      formsPage.AutomationPracticeFormElements.DateOfBirth,
    );
    await testManager.page
      .locator('select[class=react-datepicker__month-select]')
      .selectOption(MounOfBirth);
    await testManager.page
      .locator('select[class=react-datepicker__year-select]')
      .selectOption(YearOfBirth);

    await formsPage.waitAndClick(
      `.react-datepicker__day.react-datepicker__day--0${DateOfBirth}`,
    );
    testManager.logger.info(`Choose: ${BirthData} in datepicker`);
  }

  const Subjects = data[1][8];
  if (Subjects) {
    this.practiceFormInputFields.data[
      formsPage.AutomationPracticeFormInputFieldNames.Subjects
    ] = Subjects;
    await testManager.page.fill(
      formsPage.AutomationPracticeFormElements.Subjects,
      Subjects,
    );
    testManager.logger.info(
      `fill: ${Subjects} in ${formsPage.AutomationPracticeFormElements.Subjects}`,
    );
    await testManager.page.keyboard.press('Tab');
  }

  const Hobbies = data[1][9];
  if (Hobbies) {
    this.practiceFormInputFields.data[
      formsPage.AutomationPracticeFormInputFieldNames.Hobbies
    ] = Hobbies;

    await testManager.page.getByText(Hobbies).click();
    testManager.logger.info(
      `Picked: ${Hobbies} in ${formsPage.AutomationPracticeFormInputFieldNames.Hobbies}`,
    );
  }

  const CurrentAddress = data[1][10];
  if (CurrentAddress) {
    this.practiceFormInputFields.data[
      formsPage.AutomationPracticeFormInputFieldNames.Address
    ] = CurrentAddress;

    await testManager.page.fill(
      formsPage.AutomationPracticeFormElements.CurrentAddress,
      CurrentAddress,
    );
    testManager.logger.info(
      `fill: ${CurrentAddress} in ${formsPage.AutomationPracticeFormElements.CurrentAddress}`,
    );
  }

  const State = data[1][11];
  if (State) {
    await formsPage.waitAndClick(
      formsPage.AutomationPracticeFormElements.State,
    );
    await testManager.page
      .getByText(State, {
        exact: true,
      })
      .click();

    testManager.logger.info(
      `Choose: ${State} in ${formsPage.AutomationPracticeFormElements.State}}`,
    );
  }

  const City = data[1][12];
  if (City) {
    await formsPage.waitAndClick(formsPage.AutomationPracticeFormElements.City);

    await testManager.page.getByText(City, { exact: true }).click();
  }

  this.practiceFormInputFields.data[
    formsPage.AutomationPracticeFormInputFieldNames.StateAndCity
  ] = `${State} ${City}`;

  const parentSelector = '.mt-4.justify-content-end.row';
  // Evaluate JavaScript to click the button
  await testManager.page.evaluate((parentSelector) => {
    const parentElement = document.querySelector(parentSelector);
    const button = parentElement.querySelector('#submit');
    button.dispatchEvent(new MouseEvent('click'));
  }, parentSelector);

  testManager.logger.info('Pressed: #submit button');
});
