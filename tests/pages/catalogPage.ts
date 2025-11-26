import { Page, Locator } from "@playwright/test";

export class CatalogPage {
  readonly page: Page;

  readonly categorySelect: Locator;
  readonly sizeSelect: Locator;
  readonly colorSelect: Locator;
  readonly styleSelect: Locator;

  readonly qInput: Locator;
  readonly startInput: Locator;
  readonly endInput: Locator;
  readonly minPriceInput: Locator;
  readonly maxPriceInput: Locator;

  readonly searchButton: Locator;
  readonly cards: Locator;

  constructor(page: Page) {
    this.page = page;

    this.categorySelect = page.locator('select[name="category"]');
    this.sizeSelect = page.locator('select[name="size"]');
    this.colorSelect = page.locator('select[name="color"]');
    this.styleSelect = page.locator('select[name="style"]');

    this.qInput = page.locator('input[name="q"]');
    this.startInput = page.locator('input[name="start"]');
    this.endInput = page.locator('input[name="end"]');
    this.minPriceInput = page.locator('input[name="minPrice"]');
    this.maxPriceInput = page.locator('input[name="maxPrice"]');

    this.searchButton = page.getByRole("button", { name: /search/i });
    this.cards = page.getByTestId("item-card");
  }

  async goto() {
    await this.page.goto("/search");
    await this.categorySelect.waitFor({ state: "visible" });
  }


  async setQuery(text: string) {
    await this.qInput.fill(text);
  }

  async setCategory(value: string) {
    await this.categorySelect.selectOption({ value });
  }

  async setSize(value: string) {
    await this.sizeSelect.selectOption({ value });
  }

  async setColor(value: string) {
    await this.colorSelect.selectOption({ value });
  }

  async setStyle(value: string) {
    await this.styleSelect.selectOption({ value });
  }

  async setDateRange(start: string, end: string) {
    await this.startInput.fill(start);
    await this.endInput.fill(end);
  }

  async setPriceRange(min: string, max: string) {
    await this.minPriceInput.fill(min);
    await this.maxPriceInput.fill(max);
  }

  async submit() {
    await this.searchButton.click();
  }


  async getCardsCount(): Promise<number> {
    return await this.cards.count();
  }

  async getCardColorByIndex(index: number): Promise<string> {
    const color = await this.cards.nth(index).getAttribute("data-color");
    return color ?? "";
  }

  getItemByName(name: string) {
    return this.page.getByText(name);
  }

  getNoResultsMessage() {
    return this.page.getByText("No items match your filters.");
  }
}
