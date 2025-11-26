import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

test.describe('Admin authentication', () => {
  test('unauthenticated user is redirected to login', async ({ page }) => {
    await page.goto('/admin');
    const dashboardHeading = page.getByRole('heading', { name: 'Admin Dashboard' });
    if (await dashboardHeading.count() > 0) {
      const adminDashboard = new AdminDashboardPage(page);
      await adminDashboard.signOut();
    }

    const loginPage = new LoginPage(page);
    await loginPage.goto('/admin');
    await loginPage.expectLoginPageVisible();
    await expect(page.getByRole('heading', { name: /Admin Dashboard/ })).toHaveCount(0);
  });

  test('logout destroys session and redirects to login', async ({ page }) => {
    await page.goto('/admin/login');
    const loginPage = new LoginPage(page);
    await loginPage.loginWithoutCredentials();
    const adminDashboard = new AdminDashboardPage(page);
    await adminDashboard.expectDashboardVisible();

    await adminDashboard.signOut();     
    await loginPage.expectLoginPageVisible();
    await expect(page.getByRole('heading', { name: /Admin Dashboard/ })).toHaveCount(0);
  });
});
