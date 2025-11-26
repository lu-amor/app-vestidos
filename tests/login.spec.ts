import { test, expect } from '@playwright/test';
import { appUrls } from './testData/urls';
import { LoginPage } from './pages/LoginPage';

test('login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto(appUrls.loginAdmin);
    await loginPage.loginWithoutCredentials();
    await expect(page.getByRole('heading', { name: 'Admin Dashboard' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Log Out' })).toBeVisible();
    await page.getByRole('button', { name: 'Log Out' }).click();
    await expect(page.getByRole('heading', { name: 'Panel de Administración' })).toBeVisible();
});