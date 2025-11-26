import { test, expect } from './fixtures/auth';
import type { Page } from '@playwright/test';
import { fillItemForm } from './fixtures/itemHelpers';

test.describe('Items CRUD (admin)', () => {

  test('update item', async ({ loggedInPage: page }) => {
    const editBtn = page.getByRole('button', { name: /Edit|Editar/ }).first();
    await expect(editBtn).toBeVisible();
    await editBtn.click();
    await expect(page.getByText(/Update Item/)).toBeVisible();
    const updatedName = `Updated Item ${Date.now()}`;
    await fillItemForm(page, updatedName);

    await page.getByRole('button', { name: /Update/ }).click();
    await expect(page.getByText(/exitosamente/)).toBeVisible();
  });

  test('delete item', async ({ loggedInPage: page }) => {
    const editButtons = page.getByRole('button', { name: /Edit/ });
    const initialCount = await editButtons.count();
    expect(initialCount).toBeGreaterThan(0);

    const editBtn = editButtons.first();
    await expect(editBtn).toBeVisible();

    let deleteBtn = editBtn.locator(
      'xpath=following-sibling::button[normalize-space(.) = "Eliminar" or normalize-space(.) = "Delete" or contains(., "Eliminar") or contains(., "Delete")]'
    ).first();

    if ((await deleteBtn.count()) === 0) {
      deleteBtn = editBtn.locator(
        'xpath=following::button[normalize-space(.) = "Eliminar" or normalize-space(.) = "Delete" or contains(., "Eliminar") or contains(., "Delete")]'
      ).first();
    }

    if ((await deleteBtn.count()) === 0) {
      deleteBtn = page.getByRole('button', { name: /Delete/ }).first();
    }

    await deleteBtn.click();

    await expect(page.getByText(/Confirmar Eliminación|Confirm Deletion|Confirm/)).toBeVisible();
      const heading = page.getByRole('heading', { name: /Confirm Deletion/ });
      await expect(heading).toBeVisible();
      const modal = heading.locator('xpath=ancestor::div[2]');
      await expect(modal).toBeVisible();
      await modal.getByRole('button', { name: /Delete/ }).click();

    await page.waitForResponse((r) => r.url().includes('/api/items') && r.request().method() === 'DELETE');
    await page.reload();

    const editButtonsAfter = page.getByRole('button', { name: /Edit/ });
    await expect(editButtonsAfter).toHaveCount(initialCount - 1);
  });

});
