import { Page, Locator, expect } from '@playwright/test';
import { testUsers } from '../testData/credentials';

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

    async goto(url: string) {
        await this.page.goto(url);
        await this.expectLoginPageVisible();
    }

    async login() {
        await this.loginWithCredentials(testUsers.admin.username, testUsers.admin.password);
    }

    async loginWithCredentials(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.signInButton.click();
    }

    async loginWithoutCredentials() {
        await this.signInButton.click();
    }

    async expectLoginPageVisible() {
        await expect(this.adminSignInHeading).toBeVisible();
    }
}