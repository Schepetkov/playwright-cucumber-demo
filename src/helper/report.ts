const report = require('multiple-cucumber-html-reporter');

report.generate({
  jsonDir: 'test-results',
  reportPath: 'test-results/report/',
  reportName: 'Playwright Automation Report',
  pageTitle: 'Test report',
  displayDuration: false,
  metadata: {
    browser: {
      name: 'chrome',
      version: '113',
    },
    device: 'PC',
    platform: {
      name: 'Windows',
      version: '11',
    },
  },
  customData: {
    title: 'Test Info',
    data: [{ label: 'Project', value: 'demoqa.com' }],
  },
});
