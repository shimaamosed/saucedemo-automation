
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { userScenarios } from '../test-data/login.data';

const validPassword = process.env.SAUCE_PASSWORD;

if (!validPassword) {
  throw new Error('SAUCE_PASSWORD is missing. Check your .env file.');
}

test.describe('SauceDemo User Types', () => {
  for (const scenario of userScenarios) {
    test(`${scenario.username} - login behavior`, async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.goto('/');
      await loginPage.login(scenario.username, validPassword);

      if (scenario.expectedResult === 'success') {
        await expect(page).toHaveURL(/inventory\.html/);

        const inventoryPage = new InventoryPage(page);
        const productNames = await inventoryPage.getProductNames();

        expect(productNames).toHaveLength(6);
        expect(productNames.every(name => name.trim().length > 0)).toBe(true);
      } else {
        await expect(loginPage.errorMessage)
          .toHaveText('Epic sadface: Sorry, this user has been locked out.');
      }
    });
  }
});
