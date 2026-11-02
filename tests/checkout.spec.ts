import { test, expect } from '@playwright/test';

import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { OverviewPage } from '../pages/OverviewPage';

import { loginSuccessData } from '../test-data/login.data';

import {
  checkoutUsers,
  checkoutValidationScenarios,
  checkoutExpectedValues,
} from '../test-data/checkout.data';

import { products } from '../test-data/products.data';

const validPassword = process.env.SAUCE_PASSWORD;

if (!validPassword) {
  throw new Error('SAUCE_PASSWORD is missing. Check your .env file.');
}

test.describe('Checkout Tests', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto('/');
    await loginPage.login(loginSuccessData.username, validPassword);

    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    await inventoryPage.addProductToCart(products.backpack.name);
    await inventoryPage.openCart();
    await cartPage.checkout();
  });

  // Checkout validation tests
  for (const scenario of checkoutValidationScenarios) {
    test(`shows an error when ${scenario.title} @regression`, async () => {
      await checkoutPage.fillInformation(
        scenario.firstName,
        scenario.lastName,
        scenario.postalCode
      );

      await checkoutPage.continueToOverview();

      await expect(checkoutPage.errorMessage).toHaveText(
        scenario.expectedError
      );
    });
  }

  // Verify products and prices in checkout overview
  test(
    'displays the correct products and prices in checkout overview @regression',
    async ({ page }) => {
      await checkoutPage.fillInformation(
        checkoutUsers.validUser.firstName,
        checkoutUsers.validUser.lastName,
        checkoutUsers.validUser.postalCode
      );

      await checkoutPage.continueToOverview();

      const overviewPage = new OverviewPage(page);

      await expect
        .poll(() => overviewPage.getItemNames())
        .toEqual([products.backpack.name]);

      await expect
        .poll(() => overviewPage.getItemPrices())
        .toEqual([products.backpack.price]);
    }
  );

  // Verify subtotal, tax, and total calculations
  test('calculates subtotal and total correctly @regression', async ({ page }) => {
    await checkoutPage.fillInformation(
      checkoutUsers.validUser.firstName,
      checkoutUsers.validUser.lastName,
      checkoutUsers.validUser.postalCode
    );

    await checkoutPage.continueToOverview();

    const overviewPage = new OverviewPage(page);

    const subtotal = await overviewPage.getSubtotal();
    const tax = await overviewPage.getTax();
    const total = await overviewPage.getTotal();

    expect(subtotal).toBe(products.backpack.price);
    expect(tax).toBe(checkoutExpectedValues.tax);

    expect(total).toBe(
      Number((subtotal + tax).toFixed(2))
    );
  });

  // Complete the order successfully
  test(
    'completes the order successfully @regression @priority-high @severity-high',
    async ({ page }) => {
      await checkoutPage.fillInformation(
        checkoutUsers.validUser.firstName,
        checkoutUsers.validUser.lastName,
        checkoutUsers.validUser.postalCode
      );

      await checkoutPage.continueToOverview();

      const overviewPage = new OverviewPage(page);

      await overviewPage.finishOrder();

      await expect(overviewPage.confirmationHeader).toHaveText(
        'Thank you for your order!'
      );
    }
  );
});