
import { test, expect } from '@playwright/test';

import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { OverviewPage } from '../pages/OverviewPage';

import { loginSuccessData } from '../test-data/login.data';

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

    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.openCart();
    await cartPage.checkout();
  });

  test('shows an error when first name is missing @regression', async () => {
    await checkoutPage.fillInformation('', '', '');
    await checkoutPage.continueToOverview();

    await expect(checkoutPage.errorMessage)
      .toHaveText('Error: First Name is required');
  });

  test('shows an error when last name is missing @regression', async () => {
    await checkoutPage.fillInformation('Test', '', '');
    await checkoutPage.continueToOverview();

    await expect(checkoutPage.errorMessage)
      .toHaveText('Error: Last Name is required');
  });

  test('shows an error when postal code is missing @regression', async () => {
    await checkoutPage.fillInformation('Test', 'User', '');
    await checkoutPage.continueToOverview();

    await expect(checkoutPage.errorMessage)
      .toHaveText('Error: Postal Code is required');
  });

  test(
    'displays the correct products and prices in checkout overview @regression',
    async ({ page }) => {
      await checkoutPage.fillInformation('Test', 'User', '12345');
      await checkoutPage.continueToOverview();

      const overviewPage = new OverviewPage(page);

      await expect.poll(() => overviewPage.getItemNames())
        .toEqual(['Sauce Labs Backpack']);

      await expect.poll(() => overviewPage.getItemPrices())
        .toEqual([29.99]);
    }
  );

  test('calculates subtotal and total correctly @regression', async ({ page }) => {
    await checkoutPage.fillInformation('Test', 'User', '12345');
    await checkoutPage.continueToOverview();

    const overviewPage = new OverviewPage(page);

    const subtotal = await overviewPage.getSubtotal();
    const tax = await overviewPage.getTax();
    const total = await overviewPage.getTotal();

    expect(subtotal).toBe(29.99);
    expect(tax).toBe(2.40);
    expect(total).toBe(32.39);
  });

  test('completes the order successfully @regression @priority-high @severity-critical', async ({ page }) => {
    await checkoutPage.fillInformation('Test', 'User', '12345');
    await checkoutPage.continueToOverview();

    const overviewPage = new OverviewPage(page);

    await overviewPage.finishOrder();

    await expect(overviewPage.confirmationHeader)
      .toHaveText('Thank you for your order!');
  });
});
