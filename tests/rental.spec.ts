import { test, expect } from '@playwright/test';
import { DetailsPage } from './pages/DetailsPage';
import { appUrls } from './testData/urls';
import { fillRentalForm } from './fixtures/rental';

test.describe('detailsForm', () => {
    let details: DetailsPage;

    test.beforeEach(async ({ page }) => {
        details = new DetailsPage(page);
        await details.goto("3");
        await page.waitForLoadState('networkidle');
        await expect(page.locator('text=This page could not be found.')).not.toBeVisible();
        await details.waitForVisible();
    });

    test('verify page content', async ({ page }) => {
        await details.waitForVisible();
    });

    test('reserva exitosa', async ({ page }) => {
        await details.fillRentalForm({ startFromToday: 1, duration: 1 });
        await details.submitAndExpectToast('Request submitted — we will confirm via email.');
    });

    test('reserva de más de 7 días - no exitosa', async ({ page }) => {
        await details.fillRentalForm({ startFromToday: 4, duration: 10 });
        await details.submitAndExpectToast('Rental period cannot exceed 7 days.');
    });

    test('reservas superpuestas - no exitosa', async ({ page }) => {
        await details.fillRentalForm({ startFromToday: 3, duration: 1 });
        await details.submitAndExpectToast('Request submitted — we will confirm via email.');

        details = new DetailsPage(page);
        await details.goto("3");
        await details.waitForVisible(); 

        await details.fillRentalForm({ startFromToday: 3, duration: 1 });
        await details.submitAndExpectToast('Item not available for selected dates');
    });

    test('reserva con fechas ya pasadas - no exitosa', async ({ page }) => {
        await details.fillRentalForm({ startFromToday: -10, duration: 1 });

        await details.submitWithoutWaiting();

        await details.dateError();
    });

    test('reserva con fechas en el futuro - no exitosa', async ({ page }) => {        
        await details.fillRentalForm({ startFromToday: 180, duration: 1 });
        
        await details.submitWithoutWaiting();

        await details.dateError();
    });
});
