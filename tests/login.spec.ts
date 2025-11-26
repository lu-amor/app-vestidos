import { test, expect } from '@playwright/test';
import { appUrls } from './testData/urls';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

test('login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto(appUrls.loginAdmin);
    await loginPage.loginWithoutCredentials();
    const adminDashboard = new AdminDashboardPage(page);
    await adminDashboard.expectDashboardVisible();
    await adminDashboard.signOut();
    await loginPage.expectLoginPageVisible();
});