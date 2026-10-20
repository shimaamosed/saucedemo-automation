
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { loginSuccessData } from '../test-data/login.data';

const validPassword = process.env.SAUCE_PASSWORD;

if (!validPassword) {
  throw new Error('SAUCE_PASSWORD is missing. Check your .env file.');
}

test.describe('Shopping Cart', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto('/');
    await loginPage.login(loginSuccessData.username, validPassword);

    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
  });

  test('adds a product and updates the cart badge', async () => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');

    await expect(inventoryPage.getCartBadge()).toHaveText('1');
  });

test('changes Add to cart to Remove after adding a product', async () => {
  await inventoryPage.addProductToCart('Sauce Labs Backpack');

  await expect(
    inventoryPage.getProductRemoveButton('Sauce Labs Backpack')
  ).toBeVisible();

  await expect(
    inventoryPage.getProductAddButton('Sauce Labs Backpack')
  ).toHaveCount(0);
});

  test('shows the correct product name and price in the cart', async () => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.openCart();

    expect(await cartPage.getProductNames()).toEqual([
      'Sauce Labs Backpack',
    ]);

    expect(await cartPage.getProductPrices()).toEqual([29.99]);
  });

  test('shows both products when two products are added', async () => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.addProductToCart('Sauce Labs Bike Light');
    await inventoryPage.openCart();

    expect(await cartPage.getProductNames()).toEqual([
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
    ]);

    expect(await cartPage.getCartItemCount()).toBe(2);
  });

  test('removes a product from the inventory page', async () => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.removeProductFromCart('Sauce Labs Backpack');

    expect(await inventoryPage.getCartCount()).toBe(0);
  });

  test('removes a product from the cart page', async () => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.addProductToCart('Sauce Labs Bike Light');
    await inventoryPage.openCart();

    await cartPage.removeProduct('Sauce Labs Backpack');

    expect(await cartPage.getProductNames()).toEqual([
      'Sauce Labs Bike Light',
    ]);

    expect(await cartPage.getCartItemCount()).toBe(1);
  });

  test('shows an empty cart after removing all products', async () => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.openCart();

    await cartPage.removeProduct('Sauce Labs Backpack');

    expect(await cartPage.getCartItemCount()).toBe(0);
    expect(await cartPage.getProductNames()).toEqual([]);
  });
});
