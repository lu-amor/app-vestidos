import { test, expect } from '@playwright/test';

test.describe('Admin extra checks (access, logout, UI)', () => {
  test('access control: unauthenticated user is redirected to login', async ({ page }) => {
    // Try to access admin dashboard without logging in
    await page.goto('/admin');
    // The login page contains a link text 'Volver' and/or 'Panel de Administración' heading
    await expect(page.getByRole('heading', { name: /Panel de Administración|Panel de Administraci[oó]n|Acceso solo para personal autorizado/i })).toBeVisible();
    // ensure we are not seeing dashboard heading
    await expect(page.getByRole('heading', { name: /Dashboard de Administración/i })).toHaveCount(0);
  });

  test('logout destroys session and redirects to login', async ({ page }) => {
    // login first
    await page.goto('/admin/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'admin123');
    await Promise.all([
      page.waitForNavigation(),
      page.getByRole('button', { name: 'Iniciar Sesión' }).click(),
    ]);

    // Ensure dashboard visible
    await expect(page.getByRole('heading', { name: /Dashboard de Administración/i })).toBeVisible();

    // Click logout button
    const logout = page.getByRole('button', { name: 'Cerrar sesión' });
    await expect(logout).toBeVisible();
    await logout.click();

    // After logout, login form should be visible again
    await expect(page.getByRole('heading', { name: /Panel de Administración|Panel de Administraci[oó]n/i })).toBeVisible();
    // And dashboard should not be visible
    await expect(page.getByRole('heading', { name: /Dashboard de Administración/i })).toHaveCount(0);
  });

  test('login page has back link and it navigates to home', async ({ page }) => {
    await page.goto('/admin/login');
    const back = page.getByRole('link', { name: /Volver|Inicio/i });
    await expect(back).toBeVisible();
    await back.click();
    await expect(page).toHaveURL(/\/$|^http:\/\/localhost:3000\/$/);
  });

  test('open item modal and close with Escape', async ({ page }) => {
    // login
    await page.goto('/admin/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'admin123');
    await Promise.all([
      page.waitForNavigation(),
      page.getByRole('button', { name: 'Iniciar Sesión' }).click(),
    ]);

    // Open create item modal
    await page.getByRole('button', { name: /Agregar Artículo/i }).click();
    const title = page.getByText(/Agregar Nuevo Artículo|Editar Artículo/);
    await expect(title).toBeVisible();

    // Press Escape to close
    await page.keyboard.press('Escape');
    await expect(title).toHaveCount(0);
  });

  test('item form validation: cannot submit empty required fields', async ({ page }) => {
    // login
    await page.goto('/admin/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'admin123');
    await Promise.all([
      page.waitForNavigation(),
      page.getByRole('button', { name: 'Iniciar Sesión' }).click(),
    ]);

    await page.getByRole('button', { name: /Agregar Artículo/i }).click();
    // Try to submit without filling required fields
    await page.getByRole('button', { name: /Crear|Actualizar|Guardar/ }).click();
    // Expect either validation message or modal still open
    const title = page.getByText(/Agregar Nuevo Artículo|Editar Artículo/);
    await expect(title).toBeVisible();
  });
});
