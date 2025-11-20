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

    // Fill the form fields
    await page.fill('input[placeholder="Ej: Vestido de noche elegante"]', uniqueName);
    // try to select a type if the select exists
    const select = page.locator('select').first();
    if (await select.count()) {
      await select.selectOption({ index: 0 });
    }
    // fill price if present
    const price = page.locator('input[type="number"]').first();
    if (await price.count()) {
      await price.fill('25');
    }
    // check first available size checkbox if any
    const sizeLabel = page.locator('label:has(input[type="checkbox"])').first();
    if (await sizeLabel.count()) {
      await sizeLabel.click();
    }
    // color
    const color = page.locator('input[placeholder="Ej: Negro, Azul marino, Floral"]');
    if (await color.count()) {
      await color.fill('Negro');
    }
    // description
    const desc = page.locator('textarea[placeholder^="Describe el item"]');
    if (await desc.count()) {
      await desc.fill('Descripción de prueba');
    }

    // Submit create
    await page.getByRole('button', { name: /Crear/ }).click();

    // Wait for the item to appear in the list
    await expect(page.getByText(uniqueName)).toBeVisible();

    // Edit the item
    const card = page.getByText(uniqueName).locator('..').locator('..');
    await card.getByRole('button', { name: /Editar/i }).click();
    await expect(page.getByText(/Editar Artículo/)).toBeVisible();

    const updatedName = uniqueName + ' Updated';
    await page.fill('input[placeholder="Ej: Vestido de noche elegante"]', updatedName);
    await page.getByRole('button', { name: /Actualizar|Guardar|Crear/ }).click();

    await expect(page.getByText(updatedName)).toBeVisible();

    // Delete the item
    const updatedCard = page.getByText(updatedName).locator('..').locator('..');
    await updatedCard.getByRole('button', { name: /Eliminar/i }).click();

  // Confirm deletion modal - click the button inside the dialog
  await expect(page.getByText('Confirmar Eliminación')).toBeVisible();
  // move up to the modal container (title -> header -> modal body)
  const confirmDialog = page.getByText('Confirmar Eliminación').locator('..').locator('..');
  await confirmDialog.getByRole('button', { name: 'Eliminar' }).click();

    // Ensure it's gone
    await expect(page.getByText(updatedName)).toHaveCount(0);
  });
});
