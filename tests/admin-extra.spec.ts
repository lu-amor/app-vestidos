import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test.describe('Admin authentication', () => {
  test('unauthenticated user is redirected to login', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.getByRole('heading', { name: /Panel de Administración|Panel de Administraci[oó]n|Acceso solo para personal autorizado/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Dashboard de Administración/i })).toHaveCount(0);
  });

  test('logout destroys session and redirects to login', async ({ page }) => {
    await page.goto('/admin/login');
    const loginPage = new LoginPage(page);
    await loginPage.loginWithoutCredentials();
    await expect(page.getByRole('heading', { name: 'Admin Dashboard' })).toBeVisible();

    const logout = page.getByRole('button', { name: 'Log Out' });
    await expect(logout).toBeVisible();
    await logout.click();

    await page.goto('/admin');
    await expect(page.getByRole('heading', { name: /Panel de Administración|Panel de Administraci[oó]n/i })).toBeVisible();
    // And dashboard should not be visible
    await expect(page.getByRole('heading', { name: /Dashboard de Administración/i })).toHaveCount(0);
  });
});
