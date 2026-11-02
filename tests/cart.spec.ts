
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { loginSuccessData } from '../test-data/login.data';
import { products } from '../test-data/products.data';

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
    await inventoryPage.addProductToCart(products.backpack.name);

    await expect(inventoryPage.getCartBadge()).toHaveText('1');
  });

  test('changes Add to cart to Remove after adding a product', async () => {
    await inventoryPage.addProductToCart(products.backpack.name);

    await expect(
      inventoryPage.getProductRemoveButton(products.backpack.name)
    ).toBeVisible();

    await expect(
      inventoryPage.getProductAddButton(products.backpack.name)
    ).toHaveCount(0);
  });

  test('shows the correct product name and price in the cart', async () => {
    await inventoryPage.addProductToCart(products.backpack.name);
    await inventoryPage.openCart();

    await expect
      .poll(() => cartPage.getProductNames())
      .toEqual([products.backpack.name]);

    await expect
      .poll(() => cartPage.getProductPrices())
      .toEqual([products.backpack.price]);

    await expect
      .poll(() => cartPage.getProductQuantities())
      .toEqual([1]);
  });

  test('shows the correct names, prices, and quantities when two products are added', async () => {
    await inventoryPage.addProductToCart(products.backpack.name);
    await inventoryPage.addProductToCart(products.bikeLight.name);

    await expect(inventoryPage.getCartBadge()).toHaveText('2');

    await inventoryPage.openCart();

    await expect
      .poll(() => cartPage.getProductNames())
      .toEqual([
        products.backpack.name,
        products.bikeLight.name,
      ]);

    await expect
      .poll(() => cartPage.getProductPrices())
      .toEqual([
        products.backpack.price,
        products.bikeLight.price,
      ]);

    await expect
      .poll(() => cartPage.getProductQuantities())
      .toEqual([1, 1]);

    await expect
      .poll(() => cartPage.getCartItemCount())
      .toBe(2);
  });

  test('removes a product from the inventory page', async () => {
    await inventoryPage.addProductToCart(products.backpack.name);
    await inventoryPage.removeProductFromCart(products.backpack.name);

    await expect
      .poll(() => inventoryPage.getCartCount())
      .toBe(0);
  });

  test('removes a product from the cart page', async () => {
    await inventoryPage.addProductToCart(products.backpack.name);
    await inventoryPage.addProductToCart(products.bikeLight.name);
    await inventoryPage.openCart();

    await cartPage.removeProduct(products.backpack.name);

    await expect
      .poll(() => cartPage.getProductNames())
      .toEqual([products.bikeLight.name]);

    await expect
      .poll(() => cartPage.getCartItemCount())
      .toBe(1);

    await expect
      .poll(() => cartPage.getProductQuantities())
      .toEqual([1]);
  });

  test('shows an empty cart after removing all products', async () => {
    await inventoryPage.addProductToCart(products.backpack.name);
    await inventoryPage.addProductToCart(products.bikeLight.name);
    await inventoryPage.openCart();

    await cartPage.removeProduct(products.backpack.name);
    await cartPage.removeProduct(products.bikeLight.name);

    await expect
      .poll(() => cartPage.getCartItemCount())
      .toBe(0);

    await expect
      .poll(() => cartPage.getProductNames())
      .toEqual([]);
  });
});
