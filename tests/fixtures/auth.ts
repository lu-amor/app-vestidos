import { test as base, expect as baseExpect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { appUrls } from '../testData/urls';
import { testUsers } from '../testData/credentials';
import { LoginPage } from '../pages/LoginPage';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';

export const test = base.extend<{ loggedInPage: Page }>({
    loggedInPage: async ({ page }, provide) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto(appUrls.loginAdmin);
        await loginPage.loginWithoutCredentials();

        const adminDashboard = new AdminDashboardPage(page);
        await adminDashboard.expectDashboardVisible();

        await provide(page);
    },
});

export const expect = baseExpect;
