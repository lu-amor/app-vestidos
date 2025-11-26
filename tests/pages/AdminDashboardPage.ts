import { Page, Locator, expect } from '@playwright/test';

export class AdminDashboardPage {
    readonly page: Page;
    readonly dashboardHeading: Locator;
    readonly signOutButton: Locator;
    readonly inventorySection: Locator;

    constructor(page: Page) {
        this.page = page;
        this.dashboardHeading = page.getByRole('heading', { name: 'Admin dashboard' });
        this.signOutButton = page.getByRole('button', { name: 'Log Out' });
        this.inventorySection = page.locator('section', {
            has: page.getByRole('heading', { name: 'Inventory' })
        });
    }

    async expectDashboardVisible() {
        await expect(this.dashboardHeading).toBeVisible();
        await expect(this.signOutButton).toBeVisible();
    }

    async expectInventoryHeaders(headers: string[]) {
        await expect(this.page.getByRole('heading', { name: 'Inventory' })).toBeVisible();
        await expect(this.inventorySection).toBeVisible();

        for (const header of headers) {
            await expect(this.inventorySection.getByText(header, { exact: true }).first()).toBeVisible();
        }
    }

    async signOut() {
        await this.signOutButton.click();
    }
}