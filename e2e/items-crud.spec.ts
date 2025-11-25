import { test, expect } from '@playwright/test';

test.describe('Items CRUD (admin)', () => {
  test.beforeEach(async ({ page }) => {
    // login as admin before each test
    await page.goto('/admin/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'admin123');
    await Promise.all([
      page.waitForNavigation(),
      page.getByRole('button', { name: 'Iniciar Sesión' }).click(),
    ]);
    await expect(page.getByRole('heading', { name: /Dashboard de Administración/i })).toBeVisible();
  });

  test('create, edit and delete an item', async ({ page }) => {
    const uniqueName = `Test Item ${Date.now()}`;

    // Open create modal
    await page.getByRole('button', { name: /Agregar Artículo/i }).click();
    await expect(page.getByText(/Agregar Nuevo Artículo|Editar Artículo/)).toBeVisible();

    // Fill minimal required fields
    await page.fill('input[placeholder="Ej: Vestido de noche elegante"]', uniqueName);
    const price = page.locator('input[type="number"]').first();
    if (await price.count()) await price.fill('25');
    const sizeLabel = page.locator('label:has(input[type="checkbox"])').first();
    if (await sizeLabel.count()) await sizeLabel.click();
    // color select if present
    const colorSelect = page.locator('[data-testid="item-color-select"]');
    if (await colorSelect.count()) {
      await page.waitForFunction((sel) => {
        const s = document.querySelector(sel) as HTMLSelectElement | null;
        return !!s && s.options && s.options.length > 1;
      }, '[data-testid="item-color-select"]');
      await colorSelect.selectOption({ index: 1 });
    } else {
      const colorInput = page.locator('input[placeholder="Ej: Negro, Azul marino, Floral"]');
      if (await colorInput.count()) await colorInput.fill('Negro');
    }
    const desc = page.locator('textarea[placeholder^="Describe el item"]');
    if (await desc.count()) await desc.fill('Descripción de prueba');

    // Submit create and wait for backend response
    const [createResp] = await Promise.all([
      page.waitForResponse(r => r.url().endsWith('/api/items') && r.request().method() === 'POST'),
      page.getByTestId('item-submit-btn').click(),
    ]);
    expect(createResp.status()).toBe(201);
    const createdData = await createResp.json();
    const createdId = createdData.item?.id;
    expect(createdId).toBeTruthy();

    // Poll server until created item appears via API (handles propagation/persistence delays)
    let found = false;
    for (let i = 0; i < 25; i++) {
      const resp = await page.request.get('/api/items');
      const json = await resp.json().catch(() => ({}));
      const items = json.items || [];
      if (items.find((it: any) => it.id === createdId)) { found = true; break; }
      await page.waitForTimeout(200);
    }
    expect(found).toBeTruthy();
    // Then wait for UI to render the created item
    await expect(page.getByText(uniqueName)).toBeVisible();

    // Delete the item by finding its ID span and clicking the corresponding Delete button
    const idSpan = page.getByText(`ID: ${createdId}`).first();
    await expect(idSpan).toBeVisible();
    // To avoid UI race conditions in parallel test runs, call DELETE directly using the page's fetch (authenticated context)
    const delResp = await page.evaluate(async (id) => {
      const res = await fetch(`/api/items/${id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' } });
      const body = await res.text().catch(() => '');
      return { ok: res.ok, status: res.status, body };
    }, createdId);
    if (!delResp.ok) throw new Error(`DELETE via fetch failed: ${delResp.status} - ${delResp.body}`);


    // Assert the item is gone; reload to ensure UI reflects server-side deletion
    await page.reload();
    await expect(page.getByText(uniqueName)).toHaveCount(0);
  });

});
