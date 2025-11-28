import { Page, Locator } from '@playwright/test';
import { appUrls } from '../testData/urls';

export class HomePage {
    // Elementos que conforman la página
    readonly page: Page;
    readonly adminLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.adminLink = page.getByRole('link', { name: 'Admin' });
    }

    // Acciones que puedo realizar en la página interactuando con los elementos definidos.
    async goto() : Promise<void> {
        await this.page.goto(appUrls.home)
    }

    async expectVisible() : Promise<void> {
        await this.page.waitForLoadState('networkidle');
        await this.page.getByText('Look stunning without the price tag. Flexible rentals, free cleaning, and fast delivery.').isVisible();
    }
}

// Se añaden las definiciones de los elementos y los métodos correspondientes a acciones
// a medida que los voy necesitando.

