import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { DetailsPage } from './pages/DetailsPage';
import { appUrls } from './testData/urls';
import { fillRentalForm } from './fixtures/rental';

let createdRentalId: string | null = null;

test.describe('flujos de admin', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(appUrls.details('3'));
        await page.waitForLoadState('networkidle');
        await expect(page.locator('text=This page could not be found.')).not.toBeVisible();
        const details = new DetailsPage(page);
        await details.waitForVisible();

        await fillRentalForm(details, { name: "prueba", startFromToday: 40, duration: 1 });
        await details.submitAndExpectToast('Request submitted — we will confirm via email.');

        await page.goto('/admin/login');
        const loginPage = new LoginPage(page);
        await loginPage.loginWithoutCredentials();
        await expect(page.getByRole('heading', { name: 'Admin Dashboard' })).toBeVisible();
    });

    test('cancel rental from dashboard', async ({ page }) => {
        const rentalRow = page.locator('tr', { has: page.locator('text=prueba') });
        await expect(rentalRow).toBeVisible();

        await expect(rentalRow.locator('text=Active')).toBeVisible();

        const cancelButton = rentalRow.getByRole('button', { name: /Cancel/i });
        await cancelButton.click();

        await expect(rentalRow.locator('text=Cancelled')).toBeVisible({ timeout: 5000 });
    });
});
