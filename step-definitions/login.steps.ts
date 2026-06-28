import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

import { LoginPage } from '../pages/LoginPage';
import { testContext } from './hooks';

const loginPage = () => new LoginPage(testContext.page);

Given('user opens login page', async function () {
  await loginPage().navigate();
});

When('user enters valid credentials', async function () {
  await loginPage().login('admin', 'password');
});

Then('dashboard should be visible', async function () {
  await expect(testContext.page).toHaveURL(/dashboard/);
});