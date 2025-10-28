import { Page, Locator, expect } from '@playwright/test';

export class ItemPage {
    readonly page: Page;
    readonly title: Locator;

    constructor(page: Page) {
        this.page = page;
        // Item detail page renders the item name as a top-level heading
        this.title = page.getByRole('heading', { level: 1 });
    }

    async expectVisibleWithName(name: string) {
        await expect(this.title).toBeVisible();
        await expect(this.title).toHaveText(name);
    }

    async expectUrlIsForItem() {
        await expect(this.page).toHaveURL(/\/items\/\d+/);
    }
}
