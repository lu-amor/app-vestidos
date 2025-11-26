import { test, expect } from '@playwright/test';
import { DetailsPage } from './pages/DetailsPage';
import { appUrls } from './testData/urls';
import { fillRentalForm } from './fixtures/rental';

test.describe('detailsForm', () => {
    let details: DetailsPage;

    test.beforeEach(async ({ page }) => {
        await page.goto(appUrls.details("3"));
        await page.waitForLoadState('networkidle');
        await expect(page.locator('text=This page could not be found.')).not.toBeVisible();
        details = new DetailsPage(page);
        await details.waitForVisible();
    });

    test('verify page content', async ({ page }) => {
        await expect(page.locator('img[alt="Floral midi dress perfect for daytime events"]')).toBeVisible();
        await expect(page.locator('h1')).toHaveText('Floral Midi Dress');
        await expect(page.getByRole('heading', { name: 'Availability' })).toBeVisible();
        await expect(details.form).toBeVisible();
    });

    test('reserva exitosa', async ({ page }) => {
        await fillRentalForm(details, { startFromToday: 1, duration: 1 });
        await details.submitAndExpectToast('Request submitted — we will confirm via email.');
    });

    test('reserva de más de 7 días - no exitosa', async ({ page }) => {
        await fillRentalForm(details, { startFromToday: 4, duration: 10 });
        await details.submitAndExpectToast('Rental period cannot exceed 7 days.');
    });

    test('reservas superpuestas - no exitosa', async ({ page }) => {
        await fillRentalForm(details, { startFromToday: 3, duration: 1 });
        await details.submitAndExpectToast('Request submitted — we will confirm via email.');

        await page.goto('/items/3');
        details = new DetailsPage(page);
        await details.waitForVisible();

        await fillRentalForm(details, { startFromToday: 3, duration: 1 });
        await details.submitAndExpectToast('Item not available for selected dates');
    });

    test('reserva con fechas ya pasadas - no exitosa', async ({ page }) => {
        await fillRentalForm(details, { startFromToday: -10, duration: 1 });

        await details.submitWithoutWaiting();

        const validation = await details.start.evaluate((el: HTMLInputElement) => el.validationMessage);
        expect(validation.length).toBeGreaterThan(0);
    });

    test('reserva con fechas en el futuro - no exitosa', async ({ page }) => {        
        await fillRentalForm(details, { startFromToday: 180, duration: 1 });
        
        await details.submitWithoutWaiting();

        const validation = await details.start.evaluate((el: HTMLInputElement) => el.validationMessage);
        expect(validation.length).toBeGreaterThan(0);
    });
});
