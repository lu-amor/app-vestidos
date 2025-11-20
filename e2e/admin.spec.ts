import { test, expect } from '@playwright/test';

test.describe('Admin flows', () => {
  test('admin login and dashboard access', async ({ page }) => {
    await page.goto('/admin/login');

    // Ensure form inputs are visible
    await expect(page.getByLabel('Usuario')).toBeVisible();
    await expect(page.getByLabel('Contraseña')).toBeVisible();

    // Fill credentials (development defaults)
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'admin123');

    await Promise.all([
      page.waitForNavigation(),
      page.getByRole('button', { name: 'Iniciar Sesión' }).click(),
    ]);

    // Expect dashboard heading
    await expect(page.getByRole('heading', { name: /Dashboard de Administración/i })).toBeVisible();
  });

  test('cancel rental from dashboard', async ({ page }) => {
    // Login first
    await page.goto('/admin/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'admin123');
    await Promise.all([
      page.waitForNavigation(),
      page.getByRole('button', { name: 'Iniciar Sesión' }).click(),
    ]);
    // Seed data: create an item via authenticated request, then create a rental
    // Use page.request with the current page context so cookies are forwarded
    const itemResp = await page.request.post('/api/items', {
      data: {
        name: 'Seed Test Item ' + Date.now(),
        category: 'dress',
        pricePerDay: 10,
        sizes: ['S','M'],
        color: 'black'
      }
    });
    const itemJson = await itemResp.json();
    const createdItemId = itemJson?.item?.id;

    // create rental via public API (requires csrf token; use /api/rentals via form-like POST)
    // The simplest approach is to call the server-side helper route directly if available
    // Fallback: emulate creating a rental by calling the admin rentals POST endpoint if exists
    const rentalResp = await page.request.post('/api/rentals', {
      form: {
        itemId: String(createdItemId),
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '+34123456789',
        start: '2025-11-20',
        end: '2025-11-21',
        csrf: 'test-csrf'
      }
    });

    // Refresh dashboard and click first Cancel button
    await page.goto('/admin');
    const cancelBtns = page.getByRole('button', { name: 'Cancelar' });
    await expect(cancelBtns.first()).toBeVisible();
    await cancelBtns.first().click();
    // After cancelling, the UI should show 'Cancelado' for that row or the button disappears
    await expect(page.getByText('Cancelado').first()).toBeVisible();
  });
});
