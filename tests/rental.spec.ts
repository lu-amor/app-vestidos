import { test, expect } from './fixtures/createItem';
import { DetailsPage } from './pages/DetailsPage';

test.describe('detailsForm', () => {
    let details: DetailsPage;

    let createdId: number | null = null;

    test.beforeEach(async ({ page, createdItemId }) => {
        createdId = createdItemId ?? null;

        details = new DetailsPage(page);
        const idToGo = (createdId && createdId > 0) ? String(createdId) : "3";
        await details.goto(idToGo);
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
        const idToGo = (createdId && createdId > 0) ? String(createdId) : "3";
        await details.goto(idToGo);
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
