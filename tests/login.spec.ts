import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import {
  loginSuccessData,
  loginErrorScenarios,
  dismissErrorData,
} from '../test-data/login.data';

const validPassword = process.env.SAUCE_PASSWORD;

if (!validPassword) {
  throw new Error('SAUCE_PASSWORD is missing. Check your .env file.');
}

test.describe('Login', () => {
  let loginPage: LoginPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  await loginPage.goto('/');
});

test('valid user is redirected to the inventory page @smoke', async ({ page }) => {
      await loginPage.login(loginSuccessData.username, validPassword);
    await expect(page).toHaveURL(loginSuccessData.expectedUrl);
  });

  for (const scenario of loginErrorScenarios) {
test(`shows an error for ${scenario.name} @regression`, async () => {
        await loginPage.login(scenario.username, scenario.password ?? validPassword);
      await expect(loginPage.errorMessage).toHaveText(scenario.errorMessage);
    });
  }

test('error message can be dismissed with the X button @regression', async () => {
      await loginPage.login(dismissErrorData.username, dismissErrorData.password);
    
    await expect(loginPage.errorMessage).toBeVisible();

    await loginPage.dismissError();
    await expect(loginPage.errorMessage).toBeHidden();
  });
});