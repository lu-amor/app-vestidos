import { test, expect } from '@playwright/test';
import { DetailsPage } from './pages/DetailsPage';
import { formatISO, addDays } from './testData/rentalUtils';
import { fillRentalForm } from './fixtures/rental';

test.describe('detailsForm', () => {
    let details: DetailsPage;

    test.beforeEach(async ({ page }) => {
        await page.goto('/items/1');
        details = new DetailsPage(page);
        await details.waitForVisible();
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

        await page.goto('/items/1');
        details = new DetailsPage(page);
        await details.waitForVisible();

        await fillRentalForm(details, { startFromToday: 3, duration: 1 });
        await details.submitAndExpectToast('Item not available for selected dates');
    });

    test('reserva con fechas ya pasadas - no exitosa', async ({ page }) => {
        // startFromToday: -1 creates a start date in the past
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
