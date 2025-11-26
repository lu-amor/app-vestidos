import { test, expect } from '@playwright/test';
import { FAQPage } from './pages/FAQPage';

test('al hacer click en el logo va al inicio', async ({ page }) => {
    const faq = new FAQPage(page);
    await faq.goto();

    await faq.clickGlamRent();

    await expect(page.getByText('Rent designer dresses for every')).toBeVisible();
});
