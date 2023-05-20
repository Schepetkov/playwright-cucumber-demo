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
}
