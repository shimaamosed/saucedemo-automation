
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { OverviewPage } from '../pages/OverviewPage';
import { loginSuccessData } from '../test-data/login.data';
import { checkoutUsers } from '../test-data/checkout.data';

const validPassword = process.env.SAUCE_PASSWORD;

if (!validPassword) {
  throw new Error('SAUCE_PASSWORD is missing. Check your .env file.');
}

test('completes a purchase from login to order confirmation @e2e', async ({
  page,
}) => {
  // 1. Login
  const loginPage = new LoginPage(page);
  await loginPage.goto('/');
  await loginPage.login(loginSuccessData.username, validPassword);

  await expect(page).toHaveURL(/inventory\.html/);

  // 2. Read the original prices before sorting
  const inventoryPage = new InventoryPage(page);

  const originalPrices = await inventoryPage.getProductPrices();

  expect(originalPrices.length).toBeGreaterThan(1);

  // Calculate the expected ascending price order
  const expectedSortedPrices = [...originalPrices].sort(
    (a, b) => a - b
  );

  // 3. Sort products by price from low to high
  await inventoryPage.selectSortOption('lohi');

  // Verify that the displayed prices are actually sorted
  await expect
    .poll(() => inventoryPage.getProductPrices())
    .toEqual(expectedSortedPrices);

  // 4. Select the first two products after sorting
  const productNames = await inventoryPage.getProductNames();
  const productPrices = await inventoryPage.getProductPrices();

  expect(productNames.length).toBeGreaterThanOrEqual(2);

  const selectedProductNames = productNames.slice(0, 2);
  const selectedProductPrices = productPrices.slice(0, 2);

  // 5. Add both products and verify Add changes to Remove
  for (const productName of selectedProductNames) {
    await inventoryPage.addProductToCart(productName);

    await expect(
      inventoryPage.getProductRemoveButton(productName)
    ).toBeVisible();
  }

  // 6. Verify the cart badge shows exactly two items
  await expect(inventoryPage.getCartBadge()).toHaveText('2');

  // 7. Open the cart and verify its contents
  await inventoryPage.openCart();

  const cartPage = new CartPage(page);

  await expect
    .poll(() => cartPage.getProductNames())
    .toEqual(selectedProductNames);

  await expect
    .poll(() => cartPage.getProductPrices())
    .toEqual(selectedProductPrices);

  await expect
    .poll(() => cartPage.getProductQuantities())
    .toEqual([1, 1]);

  await expect
    .poll(() => cartPage.getCartItemCount())
    .toBe(2);

  // 8. Start checkout and enter customer information
  await cartPage.checkout();

  const checkoutPage = new CheckoutPage(page);

  await checkoutPage.fillInformation(
    checkoutUsers.validUser.firstName,
    checkoutUsers.validUser.lastName,
    checkoutUsers.validUser.postalCode
  );

  await checkoutPage.continueToOverview();

  // 9. Verify that the order overview is displayed
  await expect(page).toHaveURL(/checkout-step-two\.html/);

  const overviewPage = new OverviewPage(page);

  await expect
    .poll(() => overviewPage.getItemNames())
    .toEqual(selectedProductNames);

  await expect
    .poll(() => overviewPage.getItemPrices())
    .toEqual(selectedProductPrices);

  // Verify item total equals the sum of the selected product prices
  const expectedItemTotal = Number(
    selectedProductPrices
      .reduce((sum, price) => sum + price, 0)
      .toFixed(2)
  );

  const itemTotal = await overviewPage.getSubtotal();
  const tax = await overviewPage.getTax();
  const total = await overviewPage.getTotal();

  expect(itemTotal).toBe(expectedItemTotal);

  // Verify total equals item total plus tax
  const expectedTotal = Number((itemTotal + tax).toFixed(2));

  expect(total).toBe(expectedTotal);

  // 10. Finish the order
  await overviewPage.finishOrder();

  // Verify the order confirmation message
  await expect(overviewPage.confirmationHeader).toHaveText(
    'Thank you for your order!'
  );

  // 11. Verify the cart badge is no longer displayed
  await expect(inventoryPage.getCartBadge()).toHaveCount(0);

  // 12. Open the cart and verify that it is empty
  await inventoryPage.openCart();

  await expect
    .poll(() => cartPage.getCartItemCount())
    .toBe(0);

  await expect
    .poll(() => cartPage.getProductNames())
    .toEqual([]);
});
