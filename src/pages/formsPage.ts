import { ElementHandle, Page } from '@playwright/test';
import BasePage from './basePage';
import { testManager } from '../hooks/playwright';

export default class FormsPage extends BasePage {
  constructor(protected page: Page) {
    super(page);
  }

  public AutomationPracticeFormInputFieldNames = {
    StudentName: 'Student Name',
    StudentEmail: 'Student Email',
    Gender: 'Gender',
    MobileNumber: 'Mobile',
    DateOfBirth: 'Date of Birth',
    Subjects: 'Subjects',
    Hobbies: 'Hobbies',
    Picture: 'Picture',
    Address: 'Address',
    StateAndCity: 'State and City',
  };

  public AutomationPracticeFormElements = {
    FirstName: '#firstName',
    LastName: '#lastName',
    Email: '#userEmail',
    MobileNumber: '#userNumber',
    DateOfBirth: '#dateOfBirthInput',
    Subjects: '#subjectsInput',
    CurrentAddress: '#currentAddress',
    State: '#state',
    City: '#city',
    SubmitButton: '#submit',
    Picture: '#uploadPicture',
    ImagePathName: 'Toolsqa.jpg',
    datepickerMonthSelectClass: 'react-datepicker__month-select',
    datepickerYearSelectClass: 'react-datepicker__year-select',
    datepickerDaySelectLocator:
      '.react-datepicker__day.react-datepicker__day--0',
    SubmitButtonFooterOverlayLocator: '.mt-4.justify-content-end.row',
  };

  async collectPracticeFormTableFilledData() {
    await this.page.waitForSelector('.table-responsive table');
    const table = await this.page.$('.table-responsive table');
    const data: { [key: string]: string } = {};
    const rows = await table.$$('tbody tr');
    for (const row of rows) {
      const [keyElement, valueElement] = await row.$$('td');
      const key = await keyElement.innerText();
      const value = await valueElement.innerText();

      data[key] = value;
    }

    for (const key in data) {
      const value = data[key];
      testManager.logger.info(
        `collectPracticeFormTableFilledData() - Key: ${key}, Value: ${value}`,
      );
    }

    return data;
  }

  async hideFooter() {
    await testManager.page.addStyleTag({
      content: 'footer, footer span { display: none !important; }',
    });

    testManager.logger.info('HideFooter()');
  }

  async closeFooterAd() {
    await this.page.waitForSelector('#adplus-anchor');
    await this.page.evaluate(() => {
      const parentElement = document.querySelector('#adplus-anchor');
      if (parentElement) {
        parentElement.remove();
      }
    });

    testManager.logger.info('CloseFooterAd()');
  }

  async uploadPicture() {
    await this.page.waitForSelector(
      this.AutomationPracticeFormElements.Picture,
    );
    const fileInput = await testManager.page.$(
      this.AutomationPracticeFormElements.Picture,
    );
    await fileInput.setInputFiles(
      this.AutomationPracticeFormElements.ImagePathName,
    );
  }
}
