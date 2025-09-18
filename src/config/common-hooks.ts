import { After, AfterAll, Before, BeforeAll } from "@cucumber/cucumber";
BeforeAll(async function () {});

Before(async function () {});

Before(async function () {});

After(async function () {

  await this.context?.close();
});

AfterAll(async function () {
  await browser.close();
});
