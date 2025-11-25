import { test, expect } from '@playwright/test';

test('admin adds new color and public catalog shows it', async ({ page }) => {
  // login as admin
  await page.goto('/admin/login');
  await page.fill('input[name="username"]', 'admin');
  await page.fill('input[name="password"]', 'admin123');
  await Promise.all([
    page.waitForNavigation(),
    page.getByRole('button', { name: 'Iniciar Sesión' }).click(),
  ]);

  // Go to admin and add color
  await page.goto('/admin');
  await expect(page.getByText('Catálogo de filtros')).toBeVisible();
  // Use authenticated request to add the color directly (ensures cookie forwarding)
  // Use the page's context request to ensure cookies/session are forwarded
  const addResp = await page.context().request.post('/api/filters/colors', {
    data: { color: 'Verde lima' }
  });
  if (!addResp.ok()) {
    const bodyText = await addResp.text();
    let body = {};
    try { body = JSON.parse(bodyText); } catch(e) {}
    // If it's already exists, treat it as OK for idempotency in tests
    if (addResp.status() === 400 && (body as any).error === 'Already exists') {
      // proceed
    } else {
      console.error('Add color failed', addResp.status(), bodyText);
      expect(addResp.ok()).toBeTruthy();
    }
  }

  // Reload admin UI to show updated catalog
  await page.goto('/admin');
  // verify API contains the new color
  const listResp = await page.request.get('/api/filters/colors');
  const listJson = await listResp.json();
  // case-insensitive check
  const colorsLower = (listJson.colors || []).map((c: string) => c.toLowerCase());
  if (!colorsLower.includes('verde lima')) {
    console.log('API colors:', listJson.colors);
  }
  expect(colorsLower.includes('verde lima')).toBeTruthy();

  // Open public catalog and check dropdown (server-side rendered list)
  await page.goto('/search');
  const colorSelect = page.locator('select[name="color"]');
  await expect(colorSelect).toBeVisible();
  // assert option exists (case-insensitive)
  const optionTexts = await colorSelect.locator('option').allTextContents();
  const found = optionTexts.map(t => t.toLowerCase()).includes('verde lima');
  if (!found) {
    console.log('Select options:', optionTexts);
  }
  expect(found).toBeTruthy();
});
