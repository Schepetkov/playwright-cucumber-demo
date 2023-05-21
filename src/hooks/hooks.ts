import { Before, After, BeforeAll, AfterAll, Status } from '@cucumber/cucumber';
import { testManager } from './testManager';
import { Browser, BrowserContext } from '@playwright/test';
import { invokeBrowser } from '../helper/browsers/browserManager';
import { getEnv } from '../helper/env/env';
import { createLogger } from 'winston';
import { options } from '../helper/util/logger';
const fs = require('fs-extra');

let browser: Browser;
let context: BrowserContext;

BeforeAll(async function () {
  getEnv();
  browser = await invokeBrowser();
});

Before(async function ({ pickle }) {
  const scenarioName = pickle.name + pickle.id;
  context = await browser.newContext({
    recordVideo: {
      dir: 'test-results/videos',
    },
  });

  const page = await context.newPage();
  testManager.page = page;
  testManager.logger = createLogger(options(scenarioName));
});

After(async function ({ pickle, result }) {
  let videoPath: string;
  if (result?.status == Status.FAILED) {
    const image = await testManager.page.screenshot({
      path: `./test-results/screenshot/${pickle.name}.png`,
      type: 'png',
    });
    await this.attach(image, 'image/png');
    videoPath = await testManager.page.video().path();
  }

  await testManager.page.close();
  await context.close();

  if (result?.status == Status.FAILED) {
    await this.attach(fs.readFileSync(videoPath), 'video/webm');
  }
});

AfterAll(async function () {
  await browser.close();
});
