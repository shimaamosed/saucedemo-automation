
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { loginSuccessData } from '../test-data/login.data';

const validPassword = process.env.SAUCE_PASSWORD;

if (!validPassword) {
  throw new Error('SAUCE_PASSWORD is missing. Check your .env file.');
}

test.describe('Product Sorting', () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto('/');
    await loginPage.login(loginSuccessData.username, validPassword);

    inventoryPage = new InventoryPage(page);
  });

  test('sorts products by name A to Z', async () => {
    await inventoryPage.selectSortOption('az');

    await expect(inventoryPage.getSortDropdown()).toHaveValue('az');

    const names = await inventoryPage.getProductNames();
    const sortedNames = [...names].sort((a, b) =>
      a.localeCompare(b)
    );

    expect(names).toEqual(sortedNames);
  });

  test('sorts products by name Z to A', async () => {
    await inventoryPage.selectSortOption('za');

    await expect(inventoryPage.getSortDropdown()).toHaveValue('za');

    const names = await inventoryPage.getProductNames();
    const sortedNames = [...names].sort((a, b) =>
      b.localeCompare(a)
    );

    expect(names).toEqual(sortedNames);
  });

  test('sorts products by price low to high', async () => {
    await inventoryPage.selectSortOption('lohi');

    await expect(inventoryPage.getSortDropdown()).toHaveValue('lohi');

    const prices = await inventoryPage.getProductPrices();
    const sortedPrices = [...prices].sort((a, b) => a - b);

    expect(prices).toEqual(sortedPrices);
  });

  test('sorts products by price high to low', async () => {
    await inventoryPage.selectSortOption('hilo');

    await expect(inventoryPage.getSortDropdown()).toHaveValue('hilo');

    const prices = await inventoryPage.getProductPrices();
    const sortedPrices = [...prices].sort((a, b) => b - a);

    expect(prices).toEqual(sortedPrices);
  });

  test('keeps all products displayed after sorting', async () => {
    const namesBeforeSorting = await inventoryPage.getProductNames();

    await inventoryPage.selectSortOption('lohi');

    await expect(inventoryPage.getSortDropdown()).toHaveValue('lohi');

    const namesAfterSorting = await inventoryPage.getProductNames();

    expect(namesAfterSorting).toHaveLength(namesBeforeSorting.length);

    const normalizeNames = (names: string[]) =>
      [...names].sort((a, b) => a.localeCompare(b));

    expect(normalizeNames(namesAfterSorting)).toEqual(
      normalizeNames(namesBeforeSorting)
    );
  });
});
