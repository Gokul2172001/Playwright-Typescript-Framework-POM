import * as fs from 'fs';
import * as path from 'path';
import { ICustomWorld } from '../config/custom-world';

import {
  AfterAll,
  Before,
  After,
  BeforeAll,
  setDefaultTimeout,
  ITestCaseHookParameter,
  Status,
} from '@cucumber/cucumber';

import {
  Browser,
  chromium,
  ChromiumBrowser,
  ConsoleMessage,
  firefox,
  FirefoxBrowser,
  Page,
  request,
  webkit,
  WebKitBrowser,
} from '@playwright/test';

import { BROWSER } from '../config/env';
import { attachVideo } from '../utils/attachVideo';
import { browserOptions } from '../config/browserOption';
import { setBrowserName, setBrowserVersion, setEndTime, setInformations, setStartTime, setTotalExecutionTime } from '../utils/infoGen';
import { formatDuration } from '../config/info';

let browser: ChromiumBrowser | FirefoxBrowser | WebKitBrowser | Browser;
let page: Page;
let tracesDir = 'traces';
let IS_API = process.env.API;

setDefaultTimeout(30 * 1000 * 2);

BeforeAll(async function () {
  if (!IS_API)
    try {
      switch (BROWSER.toUpperCase().trim()) {
        case 'FIREFOX':
          browser = await firefox.launch(browserOptions);
          setBrowserName('Firefox')
          setBrowserVersion(browser.version())
          break;
          
        case 'WEBKIT':
          browser = await webkit.launch(browserOptions);
          setBrowserName('Webkit')
          setBrowserVersion(browser.version())
          break;
          
        case 'CHROMIUM':
          browser = await chromium.launch(browserOptions);
          setBrowserName('Chrome')
          setBrowserVersion(browser.version());
          break;
          
        default:
          console.log("**** Chromium being opened as a default browser ****");
          browser = await chromium.launch(browserOptions);
          setBrowserName('Chrome')
          setBrowserVersion(browser.version());
          break;
      }
    } catch (error) {
      console.error("Error launching browser:", error);
      browser.version();
    }
});


// Before({tags:@debug},async function (this:ICustomWorld)) {
//   this
// }

Before(async function (this: ICustomWorld, { pickle }: ITestCaseHookParameter) {
  this.startTime = new Date();
  setStartTime(this.startTime)
  this.testName = pickle.name.replace(/\W/g, '-');
  if (IS_API) {
    this.context = await browser.newContext({
      acceptDownloads: true,
      recordVideo: {
        dir: 'reports/videos/', // where videos will be saved
        size: { width: 1280, height: 720 },
      },
      viewport: { width: 1920, height: 1080 },
    });
    await this.context.tracing.start({ screenshots: true, snapshots: true });
    this.page = await this.context.newPage();

    this.page.on('console', async (msg: ConsoleMessage) => {
      if (msg.type() == 'log') await this.attach(msg.text());
    });
  }
  this.feature = pickle;

});

Before({ tags: '@ignore' }, async function () {
  return 'skipped' as any;
});

// This sets the output folder
// setDefaultOptions({
//   resultsDir: 'allure-results',
// });

// import { attachVideo } from '../utils/attachVideo'; // make sure the import path is correct

After(async function (this: ICustomWorld, { result }: ITestCaseHookParameter) {
  if(!IS_API)
  if (!this.page || !this.context) return;

  const testPassed = result?.status === Status.PASSED;

  if (!testPassed) {
    const screenshot = await this.page.screenshot();
    await this.attach(screenshot, 'image/png');

    const timePart = this.startTime?.toISOString().split('.')[0].replaceAll(':', '_');

    await this.context?.tracing.stop({
      path: `${tracesDir}/${this.testName}-${timePart}trace.zip`,
    });
  }

  // Close page and context after screenshot and before attaching video
  await this.page.close();
  await this.context.close();
  // Attach renamed & playable video
  let endTime = new Date();
  setEndTime(endTime)
  setTotalExecutionTime(formatDuration(this.startTime, endTime))
  await attachVideo.call(this, testPassed);
});

AfterAll(async () => {
  await browser.close();
});
