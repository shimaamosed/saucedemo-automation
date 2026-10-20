
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

test('completes a purchase from login to order confirmation @e2e', async ({
  page,
}) => {
  // 1. Login
  const loginPage = new LoginPage(page);
  await loginPage.goto('/');
    await loginPage.login(loginSuccessData.username, validPassword);

  await expect(page).toHaveURL(/inventory\.html/);

  // 2. Add a product to the cart
  const inventoryPage = new InventoryPage(page);
  const productName = 'Sauce Labs Backpack';

  await inventoryPage.addProductToCart(productName);
  await expect(inventoryPage.getCartBadge()).toHaveText('1');

  // 3. Open the cart and verify the product
  await inventoryPage.openCart();

  const cartPage = new CartPage(page);
  await expect(page.getByTestId('inventory-item-name'))
    .toHaveText([productName]);

  // 4. Start checkout
  await cartPage.checkout();

  // 5. Enter checkout information
  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.fillInformation('Shaimaa', 'Ahmed', '12345');
  await checkoutPage.continueToOverview();

  // 6. Verify the order overview
  const overviewPage = new OverviewPage(page);

  await expect.poll(() => overviewPage.getItemNames())
    .toEqual([productName]);

  await expect.poll(() => overviewPage.getItemPrices())
    .toEqual([29.99]);
    

  // 7. Finish the order
  await overviewPage.finishOrder();

  await expect(overviewPage.confirmationHeader)
    .toHaveText('Thank you for your order!');
});
