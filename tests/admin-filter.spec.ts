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

  // Go to admin and add color via the UI
  await page.goto('/admin');
  // Wait for admin colors panel - target the heading specifically to avoid ambiguous matches
  await expect(page.getByRole('heading', { name: /Catálogo de colores|Catálogo de filtros/ })).toBeVisible();

  const newColor = 'Verde lima';
  await page.fill('[data-testid="admin-new-color-input"]', newColor);
  // Trigger the Add button via page.evaluate to avoid transient detaches
  await page.evaluate(() => {
    const btn = document.querySelector('[data-testid="admin-add-color-btn"]') as HTMLButtonElement | null;
    if (btn) btn.click();
  });

  // Poll the API until the new color appears (up to ~5s)
  const maxAttempts = 25;
  let foundInApi = false;
  for (let i = 0; i < maxAttempts; i++) {
    const resp = await page.request.get('/api/filters/colors');
    const json = await resp.json().catch(() => ({}));
    const colors = (json.colors || []).map((c: string) => c.toLowerCase());
    if (colors.includes(newColor.toLowerCase())) {
      foundInApi = true;
      break;
    }
    await page.waitForTimeout(200);
  }
  expect(foundInApi).toBeTruthy();

  // Click the refresh button to reload from server and update UI
  await page.evaluate(() => {
    const btn = document.querySelector('[data-testid="admin-refresh-colors-btn"]') as HTMLButtonElement | null;
    if (btn) btn.click();
  });

  // Ensure the new color appears in the admin UI (poll DOM for stability)
  const chipSelector = `[data-testid="color-chip-${newColor}"]`;
  let chipVisible = false;
  for (let i = 0; i < 25; i++) {
    const count = await page.locator(chipSelector).count();
    if (count > 0) { chipVisible = true; break; }
    await page.waitForTimeout(200);
  }
  if (!chipVisible) {
    const html = await page.locator('body').innerHTML();
    console.log('Admin DOM snapshot (truncated):', html.slice(0, 3000));
  }
  expect(chipVisible).toBeTruthy();

  // Open public catalog and check dropdown (server-side rendered list)
  await page.goto('/search');
  const colorSelect = page.locator('select[name="color"]');
  await expect(colorSelect).toBeVisible();
  // assert option exists (case-insensitive)
  const optionTexts = await colorSelect.locator('option').allTextContents();
  const found = optionTexts.map(t => t.toLowerCase()).includes(newColor.toLowerCase());
  if (!found) {
    console.log('Select options:', optionTexts);
  }
  expect(found).toBeTruthy();
});
