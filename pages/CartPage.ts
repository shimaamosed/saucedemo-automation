
import { type Locator, type Page } from '@playwright/test';

export class CartPage {
  private readonly page: Page;
  private readonly cartItems: Locator;
  private readonly cartItemNames: Locator;
  private readonly cartItemPrices: Locator;
  private readonly checkoutButton: Locator;
  private readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.cartItems = page.getByTestId('inventory-item');
    this.cartItemNames = page.getByTestId('inventory-item-name');
    this.cartItemPrices = page.getByTestId('inventory-item-price');
    this.checkoutButton = page.getByTestId('checkout');
    this.continueShoppingButton = page.getByTestId('continue-shopping');
  }

  async getProductNames(): Promise<string[]> {
    return this.cartItemNames.allTextContents();
  }

  async getProductPrices(): Promise<number[]> {
    const prices = await this.cartItemPrices.allTextContents();

    return prices.map((price) =>
      Number(price.replace('$', '').trim())
    );
  }

  async getCartItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  private getCartItem(productName: string): Locator {
    return this.cartItems.filter({
      has: this.page.getByTestId('inventory-item-name').getByText(
        productName,
        { exact: true }
      ),
    });
  }

  async removeProduct(productName: string): Promise<void> {
    const product = this.getCartItem(productName);

    await product.getByRole('button', { name: 'Remove' }).click();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }
}
