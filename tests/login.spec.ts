import { test, expect } from '@playwright/test';
import { testUsers } from './testData/credentials';
import { appUrls } from './testData/urls';

test('test', async ({ page }) => {
    await page.goto(appUrls.loginAdmin);
    await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
    await expect(page.getByRole('heading', { name: 'Admin Dashboard' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Log Out' })).toBeVisible();
    await page.getByRole('button', { name: 'Log Out' }).click();
    await expect(page.getByRole('heading', { name: 'Panel de Administración' })).toBeVisible();
});