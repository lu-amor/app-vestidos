
import { Page, Locator, expect } from '@playwright/test';
import { appUrls } from '../testData/urls';

export class FAQPage {
	readonly page: Page;
	readonly heading: Locator;
	readonly glamRentLink: Locator;

	constructor(page: Page) {
		this.page = page;
		this.heading = page.getByRole('heading', { name: 'Frequently Asked Questions' });
		this.glamRentLink = page.getByRole('link', { name: 'GlamRent' });
	}

	async goto(): Promise<void> {
		await this.page.goto(appUrls.faq);
		await this.expectVisible();
	}

	async expectVisible() {
		await expect(this.heading).toBeVisible();
	}

	async clickGlamRent() {
		await this.glamRentLink.click();
	}
}
