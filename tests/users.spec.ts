
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { userScenarios } from '../test-data/login.data';

const validPassword = process.env.SAUCE_PASSWORD;

if (!validPassword) {
  throw new Error('SAUCE_PASSWORD is missing. Check your .env file.');
}

test.describe('SauceDemo User Types', () => {
  for (const scenario of userScenarios) {
    test(`${scenario.username} - login and add to cart behavior`, async ({
      page,
    }) => {
      const loginPage = new LoginPage(page);

      await loginPage.goto('/');
      await loginPage.login(scenario.username, validPassword);

      if (scenario.expectedResult === 'success') {
        // 1. Verify successful login
        await expect(page).toHaveURL(/inventory\.html/);

        const inventoryPage = new InventoryPage(page);

        // 2. Verify that products are loaded
        await expect
          .poll(() => inventoryPage.getProductNames())
          .not.toEqual([]);

        const productNames = await inventoryPage.getProductNames();
        const selectedProductName = productNames[0];

        // 3. Add the first available product to the cart
        await inventoryPage.addProductToCart(selectedProductName);

        // 4. Verify Add button changes to Remove
        await expect(
          inventoryPage.getProductRemoveButton(selectedProductName)
        ).toBeVisible();

        // 5. Verify cart badge
        await expect(inventoryPage.getCartBadge()).toHaveText('1');

        // 6. Open cart and verify the selected product
        await inventoryPage.openCart();

        const cartPage = new CartPage(page);

        await expect
          .poll(() => cartPage.getProductNames())
          .toEqual([selectedProductName]);

        await expect
          .poll(() => cartPage.getProductQuantities())
          .toEqual([1]);

        await expect
          .poll(() => cartPage.getCartItemCount())
          .toBe(1);

      } else if (scenario.expectedResult === 'locked') {
        // Verify that locked-out user cannot log in
        await expect(loginPage.errorMessage).toHaveText(
          'Epic sadface: Sorry, this user has been locked out.'
        );
      }
    });
  }
});
