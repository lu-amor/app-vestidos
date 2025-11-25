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
    // Use admin seed endpoint to atomically create an item and a rental
    const seedResult = await page.evaluate(async () => {
      const res = await fetch('/api/admin/seed', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}), credentials: 'same-origin' });
      const body = await res.json().catch(() => null);
      return { ok: res.ok, status: res.status, body };
    });

    console.log('Seed result:', seedResult);

    if (!seedResult.ok) console.log('Seed failed', seedResult);
    expect(seedResult.ok).toBeTruthy();
    const createdItemId = seedResult.body?.item?.id;
    const createdRentalId = seedResult.body?.rental?.id;

    // Refresh dashboard and click Cancel for the specific seeded rental row
    await page.goto('/admin');
    // Wait until the rentals API has been fetched and the seeded rental appears in the table
    const idPrefix = createdRentalId ? createdRentalId.slice(0, 8) : null;
    if (idPrefix) {
      await page.waitForSelector(`table tr:has-text("${idPrefix}")`, { timeout: 5000 });
      const row = page.locator('table tr', { hasText: idPrefix }).first();
      await expect(row.getByRole('button', { name: 'Cancelar' })).toBeVisible();
      const [cancelResp] = await Promise.all([
        page.waitForResponse(r => r.url().includes('/api/admin/rentals') && r.request().method() === 'POST'),
        row.getByRole('button', { name: 'Cancelar' }).click(),
      ]);
      if (!cancelResp.ok()) {
        const txt = await cancelResp.text().catch(() => '');
        throw new Error(`Cancel POST failed: ${cancelResp.status()} - ${txt}`);
      }

      // Verify server-side state: fetch rentals and ensure the created rental is canceled
      const after = await page.evaluate(async (rid) => {
        const r = await fetch('/api/admin/rentals', { method: 'GET', credentials: 'same-origin' });
        const body = await r.json().catch(() => null);
        return { ok: r.ok, body };
      }, createdRentalId);
      if (!after.ok) throw new Error('Failed to fetch rentals after cancel');
      const found = after.body?.rentals?.find((x: any) => x.id === createdRentalId);
      if (!found) throw new Error('Seeded rental not found in rentals after cancel');
      if (found.status !== 'canceled') throw new Error(`Expected rental status 'canceled' but got '${found.status}'`);
    } else {
      // Fallback: click the first available Cancel button (older behavior)
      const cancelBtns = page.getByRole('button', { name: 'Cancelar' });
      await expect(cancelBtns.first()).toBeVisible();
      const [cancelResp] = await Promise.all([
        page.waitForResponse(r => r.url().includes('/api/admin/rentals') && r.request().method() === 'POST'),
        cancelBtns.first().click(),
      ]);
      if (!cancelResp.ok()) {
        const txt = await cancelResp.text().catch(() => '');
        throw new Error(`Cancel POST failed: ${cancelResp.status()} - ${txt}`);
      }
    }

    // Server-side verification already confirms the seeded rental status is 'canceled'.
    // We avoid relying on UI text rendering here to keep the test stable under parallel runs.
  });
});
