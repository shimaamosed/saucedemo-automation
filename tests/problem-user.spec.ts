
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { products } from '../test-data/products.data';
import { users } from '../test-data/login.data';

const password = process.env.SAUCE_PASSWORD;

if (!password) {
  throw new Error('SAUCE_PASSWORD is missing. Check your .env file.');
}

test.describe('Problem User - Functional Tests', () => {
  test('adds a product to the cart successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto('/');
await loginPage.login(users.problem, password);
    await expect(page).toHaveURL(/inventory\.html/);

    const productName = products.backpack.name;

    await inventoryPage.addProductToCart(productName);

    await expect(inventoryPage.getProductRemoveButton(productName))
      .toBeVisible();

    await expect(inventoryPage.getCartBadge()).toHaveText('1');

    await inventoryPage.openCart();

    await expect(page.getByTestId('inventory-item-name'))
      .toHaveText([productName]);
  });
  
});
