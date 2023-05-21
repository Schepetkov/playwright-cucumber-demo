import { Page } from '@playwright/test';
import BasePage from './basePage';
import { testManager } from '../hooks/playwright';

export default class FormsPage extends BasePage {
  constructor(protected page: Page) {
    super(page);
  }

  public TableResponsiveElements = {
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

  public PageElements = {
    FirstNameInput: '#firstName',
    LastNameInput: '#lastName',
    EmailInput: '#userEmail',
    MobileNumberInput: '#userNumber',
    DateOfBirthInput: '#dateOfBirthInput',
    SubjectsInput: '#subjectsInput',
    CurrentAddressInput: '#currentAddress',
    StateInput: '#state',
    CityInput: '#city',
    SubmitButton: '#submit',
    UploadPictureInput: '#uploadPicture',
    ImagePathName: 'Toolsqa.jpg',
    DatepickerMonthSelectClass: 'react-datepicker__month-select',
    DatepickerYearSelectClass: 'react-datepicker__year-select',
    DatepickerDaySelectLocator:
      '.react-datepicker__day.react-datepicker__day--0',
    SubmitButtonFooterOverlayLocator: '.mt-4.justify-content-end.row',
    ResponsiveTableLocator: '.table-responsive table',
  };

  async collectPracticeFormTableFilledData() {
    await this.page.waitForSelector(this.PageElements.ResponsiveTableLocator);
    const table = await this.page.$(this.PageElements.ResponsiveTableLocator);
    const data: { [key: string]: string } = {};
    const rows = await table.$$(this.tableBodyRows);
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

  async uploadPicture() {
    await this.page.waitForSelector(this.PageElements.UploadPictureInput);
    const fileInput = await testManager.page.$(
      this.PageElements.UploadPictureInput,
    );
    await fileInput.setInputFiles(this.PageElements.ImagePathName);
  }
}
