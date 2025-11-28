import { test, expect } from '@playwright/test';
import { FAQPage } from './pages/FAQPage';
import { HomePage } from './pages/HomePage';

test('FAQ page contains expected text', async ({ page }) => {
    const faq = new FAQPage(page);
    await faq.goto();
    await faq.expectVisible();
});

test('al hacer click en el logo va al inicio', async ({ page }) => {
    const faq = new FAQPage(page);
    const homePage = new HomePage(page);
    await faq.goto();

    await faq.clickGlamRent();

    await homePage.expectVisible();
});
