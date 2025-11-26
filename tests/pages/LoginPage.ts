import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly signInButton: Locator;
    readonly adminSignInHeading: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.getByLabel('Usuario');
        this.passwordInput = page.getByLabel('Contraseña');
        this.signInButton = page.getByRole('button', { name: 'Iniciar Sesión' });
        this.adminSignInHeading = page.getByRole('heading', { name: 'Panel de Administración' });
    }

    async login() {
        await this.signInButton.click();
    }

    async expectLoginPageVisible() {
        await expect(this.adminSignInHeading).toBeVisible();
    }
}