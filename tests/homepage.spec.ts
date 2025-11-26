import { test, expect } from '@playwright/test';

test('homepage shows footer with contact info', async ({ page }) => {
    await page.goto('/');

    const footer = page.locator('footer');

    await footer.scrollIntoViewIfNeeded();

    await expect(footer).toBeVisible();

    await expect(footer).toContainText('Contact us:');
    await expect(footer).toContainText('glamrent@example.com');
    await expect(footer).toContainText('GlamRent');
});