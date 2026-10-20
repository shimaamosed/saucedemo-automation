
import { type Locator, type Page } from '@playwright/test';

export class InventoryPage {
  private readonly page: Page;
  private readonly sortDropdown: Locator;
  private readonly productNames: Locator;
  private readonly productPrices: Locator;
  private readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;

    this.sortDropdown = page.getByTestId('product-sort-container');
    this.productNames = page.getByTestId('inventory-item-name');
    this.productPrices = page.getByTestId('inventory-item-price');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
  }

  async selectSortOption(
    option: 'az' | 'za' | 'lohi' | 'hilo'
  ): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  async getProductNames(): Promise<string[]> {
    return this.productNames.allTextContents();
  }

  async getProductPrices(): Promise<number[]> {
    const prices = await this.productPrices.allTextContents();

    return prices.map((price) =>
      Number(price.replace('$', '').trim())
    );
  }

  private getProductCard(productName: string): Locator {
    return this.page
      .getByTestId('inventory-item')
      .filter({
        has: this.page.getByTestId('inventory-item-name').getByText(
          productName,
          { exact: true }
        ),
      });
  }

  async addProductToCart(productName: string): Promise<void> {
    const product = this.getProductCard(productName);

    await product.getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeProductFromCart(productName: string): Promise<void> {
    const product = this.getProductCard(productName);

    await product.getByRole('button', { name: 'Remove' }).click();
  }

  async getCartCount(): Promise<number> {
    if (await this.cartBadge.count() === 0) {
      return 0;
    }

    return Number(await this.cartBadge.innerText());
  }

  async openCart(): Promise<void> {
    await this.page.getByTestId('shopping-cart-link').click();
  }

  getCartBadge(): Locator {
    return this.cartBadge;
  }

  getProductRemoveButton(productName: string): Locator {
    return this.getProductCard(productName)
      .getByRole('button', { name: 'Remove' });
  }
  getSortDropdown(): Locator {
  return this.sortDropdown;
}
getProductAddButton(productName: string): Locator {
  return this.getProductCard(productName)
    .getByRole('button', { name: 'Add to cart' });
}
}
