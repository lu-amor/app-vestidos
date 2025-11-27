import page from '@/src/app/items/[id]/page';
import { Page, Locator, expect } from '@playwright/test';
import { formatISO, addDays } from '../testData/rentalUtils';
import { appUrls } from '../testData/urls';
import { getItem } from '../../lib/RentalManagementSystem';

export type FillOptions = {
    name?: string;
    email?: string;
    phone?: string;
    startFromToday?: number;
    duration?: number;
};

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
    item?: any;

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
        const expected = this.item ?? { alt: 'Floral midi dress perfect for daytime events', name: 'Floral Midi Dress' };
        await expect(this.page.locator(`img[alt="${expected.alt}"]`)).toBeVisible();
        await expect(this.page.locator('h1')).toHaveText(expected.name);
        await expect(this.page.getByRole('heading', { name: 'Availability' })).toBeVisible();
        await expect(this.form).toBeVisible();
    }

    async fillForm({ name, email, phone, start, end }: { name: string; email: string; phone: string; start: string; end: string; }) {
        await this.name.fill(name);
        await this.email.fill(email);
        await this.phone.fill(phone);
        await this.start.fill(start);
        await this.end.fill(end);
    }

    async fillRentalForm(opts: FillOptions = {}) {
        const name = opts.name ?? 'Juan';
        const email = opts.email ?? 'juan@example.com';
        const phone = opts.phone ?? '091123123';
        const startFromToday = opts.startFromToday ?? 1;
        const duration = opts.duration ?? 1;
        const today = new Date();
        const start = addDays(today, startFromToday);
        const end = addDays(start, duration);

        await this.fillForm({
            name,
            email,
            phone,
            start: formatISO(start),
            end: formatISO(end),
        });

        return { name, email, phone, start, end };
    }

    async goto(itemID: string) {
        // capture the server-side item data used by the app so assertions use the same expected values
        this.item = getItem(Number(itemID));
        await this.page.goto(appUrls.details(itemID));
    }

    async disableNativeValidation() {
        await this.form.evaluate((f: HTMLFormElement) => { f.noValidate = true; });
    }

    async submitAndExpectToast(expectedText: string) {
        await this.submit.click();
        await expect(this.toastError(expectedText)).toBeVisible({ timeout: 5000 });
    }

    async dateError() {
        const validation = await this.start.evaluate((el: HTMLInputElement) => el.validationMessage);
        expect(validation.length).toBeGreaterThan(0);
    }

    async submitWithoutWaiting(opts?: { skipNativeValidation?: boolean }) {
        if (opts?.skipNativeValidation) await this.disableNativeValidation();
        await this.submit.click();
    }

    toastError(expectedText: string) {
        return this.page.locator(`text=${expectedText}`);
    }
}
