import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

test.describe('Admin filter management', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/admin/login');
        const loginPage = new LoginPage(page);
        await loginPage.loginWithoutCredentials();
        const adminDashboard = new AdminDashboardPage(page);
        await adminDashboard.expectDashboardVisible();
    });

    test('admin adds new color', async ({ page }) => {
        const newColor = 'newcolor' + Date.now();
        console.log('Adding color:', newColor);

        await page.getByPlaceholder('Nuevo color').fill(newColor);
        await page.getByRole('button', { name: 'Agregar' }).click();

        await expect(page.getByText('Color agregado')).toBeVisible();

        await page.getByRole('button', { name: 'Add Item' }).click();

        await expect(page.getByRole('heading', { name: 'Add New Item' })).toBeVisible();

        const colorCombobox = page.getByRole('combobox').nth(1);
        await expect(colorCombobox).toBeVisible();

        await colorCombobox.selectOption({ label: newColor });

        await expect(colorCombobox.locator('option:checked')).toHaveText(newColor);
    });
});