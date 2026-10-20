
import { type Locator, type Page } from '@playwright/test';

export class OverviewPage {
  private readonly page: Page;
  private readonly itemNames: Locator;
  private readonly itemPrices: Locator;
  private readonly subtotalLabel: Locator;
  private readonly taxLabel: Locator;
  private readonly totalLabel: Locator;
  private readonly finishButton: Locator;
  readonly confirmationHeader: Locator;

  constructor(page: Page) {
    this.page = page;

    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.subtotalLabel = page.getByTestId('subtotal-label');
    this.taxLabel = page.getByTestId('tax-label');
    this.totalLabel = page.getByTestId('total-label');
    this.finishButton = page.getByTestId('finish');
    this.confirmationHeader = page.getByTestId('complete-header');
  }

  async getItemNames(): Promise<string[]> {
    return this.itemNames.allTextContents();
  }

  async getItemPrices(): Promise<number[]> {
    const prices = await this.itemPrices.allTextContents();

    return prices.map((price) =>
      Number(price.replace('$', '').trim())
    );
  }

  async getSubtotal(): Promise<number> {
    const text = await this.subtotalLabel.innerText();
    return Number(text.replace('Item total: $', '').trim());
  }

  async getTax(): Promise<number> {
    const text = await this.taxLabel.innerText();
    return Number(text.replace('Tax: $', '').trim());
  }

  async getTotal(): Promise<number> {
    const text = await this.totalLabel.innerText();
    return Number(text.replace('Total: $', '').trim());
  }

  async finishOrder(): Promise<void> {
    await this.finishButton.click();
  }
}
