import { After, AfterAll, Before, BeforeAll } from "@cucumber/cucumber";
BeforeAll(async function () {});

Before(async function () {});

Before(async function () {});

After(async function () {});

AfterAll(async function () {
  await browser.close();
});
