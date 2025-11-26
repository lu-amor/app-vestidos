import type { Page } from '@playwright/test';

export async function fillItemForm(page: Page, name: string) {
  await page.fill('input[placeholder="Ej: Vestido de noche elegante"]', name);
  const price = page.locator('input[type="number"]').first();
  if (await price.count()) await price.fill('25');
  const sizeLabel = page.locator('label:has(input[type="checkbox"])').first();
  if (await sizeLabel.count()) await sizeLabel.click();
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
  const fileInput = page.locator('input[type="file"]');
  if (await fileInput.count()) {
    const imgPath = 'public/images/dresses/silk-evening-gown.jpg';
    await fileInput.setInputFiles(imgPath);
  }
}
