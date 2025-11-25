import { Page, Locator, expect } from '@playwright/test';

export class DetailsPage {
    readonly page: Page;
    readonly form: Locator;
    readonly name: Locator;
    readonly email: Locator;
    readonly phone: Locator;
    readonly start: Locator;
    readonly end: Locator;
    readonly submit: Locator;
    readonly toast: (text: string) => Locator;

    constructor(page: Page) {
        this.page = page;
        this.form = page.locator('form');
        this.name = page.locator('#name');
        this.email = page.locator('#email');
        this.phone = page.locator('#phone');
        this.start = page.locator('#start');
        this.end = page.locator('#end');
        this.submit = page.locator('button:has-text("Request rental")');
        this.toast = (text: string) => page.locator(`text=${text}`);
    }

    async waitForVisible() {
        await expect(this.form).toBeVisible();
    }

    async fillForm({ name, email, phone, start, end }: { name: string; email: string; phone: string; start: string; end: string; }) {
        await this.name.fill(name);
        await this.email.fill(email);
        await this.phone.fill(phone);
        await this.start.fill(start);
        await this.end.fill(end);
    }

    async disableNativeValidation() {
        await this.form.evaluate((f: HTMLFormElement) => { f.noValidate = true; });
    }

    async submitAndExpectToast(expectedText: string) {
        await this.submit.click();
        await expect(this.toastError(expectedText)).toBeVisible({ timeout: 5000 });
    }


    async submitWithoutWaiting(opts?: { skipNativeValidation?: boolean }) {
        if (opts?.skipNativeValidation) await this.disableNativeValidation();
        await this.submit.click();
    }

    toastError(expectedText: string) {
        return this.page.locator(`text=${expectedText}`);
    }
}
