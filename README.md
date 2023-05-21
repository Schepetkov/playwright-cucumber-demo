# playwright-cucumber-demo

This project is a comprehensive testing suite for the https://demoqa.com/ website. It includes UI test cases and API examples, all implemented using TypeScript and following the Page Object Model (POM) design pattern. The project also utilizes Cucumber JS for Behavior Driven Development (BDD) testing.

## Introduction

The aim of this project is to provide a robust and reliable testing framework for the https://demoqa.com/ website. It covers both UI testing and API testing, allowing for end-to-end validation of the application's functionality. By adopting the BDD approach with Cucumber, the project enhances collaboration and communication between stakeholders.

By using the TypeScript programming language, we benefit from its strong typing system and modern language features, enabling better code organization, maintainability, and scalability. The project follows the Page Object Model (POM) design pattern, which promotes code reusability and enhances test readability.

## Features

1. **Awesome report with screenshots, videos & logs**: The project generates detailed reports with screenshots, videos, and logs for comprehensive test result analysis.

2. **Execute tests on multiple environments**: It supports running tests on multiple environments, allowing for testing against different configurations.

3. **Parallel execution**: The project enables parallel test execution, optimizing test suite run time.

4. **Rerun only failed features**: It provides the ability to rerun only the failed features, saving time during test debugging and troubleshooting.

5. **Retry failed tests on CI**: The project includes the functionality to automatically retry failed tests when executed on Continuous Integration (CI) platforms.

6. **GitHub Actions integrated with downloadable report**: It integrates with GitHub Actions, providing seamless CI/CD integration and generating downloadable reports.

7. **Page Object Model**: The project follows the Page Object Model (POM) design pattern to improve code organization and maintainability. Each page or component of the application has its dedicated page object, encapsulating the interactions and assertions related to that specific element.

## Project Structure

- **.github**: Contains YAML files for executing tests in GitHub Actions.
- **src**: Contains all the features and TypeScript code.
- **test-results**: Contains all the files related to test reports.

## Reports

The project generates the following types of reports:

1. **Multiple Cucumber Report**: Utilizes the [multiple-cucumber-html-reporter](https://github.com/WasiqB/multiple-cucumber-html-reporter) library to generate detailed HTML reports.
2. **Default Cucumber Report**: Generates a default Cucumber report showcasing test results and statistics.
3. **Logs**: Logs are captured and included in the report, aiding in debugging and troubleshooting.
4. **Screenshots of Failure**: Screenshots are captured for failed test scenarios, providing visual evidence of issues.
5. **Test Videos of Failure**: Videos are recorded for failed test scenarios, allowing for further analysis of issues.

## Get Started

### Setup

1. Clone or download the project.
2. Extract and open it in your preferred code editor (e.g., Visual Studio Code).
3. Run `npm install` to install the project dependencies.
4. Run `npx playwright install` to install the required browsers.
5. Execute tests by running `npm test`.

### Folder Structure

The project follows the following folder structure:

- **src/pages**: Contains page objects representing UI screens.
- **src/test/features**: Test scenarios are written in Gherkin format in this folder.
- **src/test/steps**: Step definitions corresponding to the test scenarios are implemented here.
- **src/hooks/hooks.ts**: Browser setup and teardown logic are defined in this file.
- **src/hooks/testManager.ts**: A helper file

### Why BDD (Behavioral Driven Development)?
```
Feature: Buy an item
Given anonumous user is on the main site
When user searches for "a horse walks into a bar"
Then results list contains 5 items
When user selects "a horse walks into a bar" book
And user adds selected book to the cart
And user goes to shopping cart
Then cart contains 1 item
```
### If you compare the above to a test scenario written in a language like Javascript it is easy to see why the Gherkin syntax makes easier communication.
```
describe('shopping', () => {
   test('buying a book item', async () => {
      await goto('https://my-shopping.com');
      await enterSearchItem('A horse walks into a bar');
      const resultListLength = await resultsPage.getList();
      expect(resultListLength).toEqual(5);
      await selectItem('a horse walks int a bar');
      await addSelectedToList();
      const shoppingCartTotalItems =  await             
shoppingCart.getTotalItems();
      expect(shoppingCartTotalItems).toEqual(1);
   });
});
```