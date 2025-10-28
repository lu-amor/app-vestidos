import { Page, Locator } from '@playwright/test';
import { appUrls } from '../testData/urls';

export class HomePage {
    // Elementos que conforman la página
    readonly page: Page;
    readonly adminLink: Locator;
    readonly firstViewDetailsLink: Locator;
    readonly firstItemName: Locator;

    constructor(page: Page) {
        this.page = page;
        this.adminLink = page.getByRole('link', { name: 'Admin' });
        this.firstViewDetailsLink = page.getByRole('link', { name: 'View details' }).first();
        this.firstItemName = page.locator('#featured p.font-medium').first();
    }

    // Acciones que puedo realizar en la página interactuando con los elementos definidos.
    async goto(): Promise<void> {
        await this.page.goto(appUrls.home);
        await this.page.waitForSelector('#featured'); // Espera a que se cargue la sección
        await this.page.waitForSelector('text=View details'); // Asegura que haya al menos un item visible
    }


    async navigateToAdmin() : Promise<void> {
        await this.adminLink.click();
    }

    async getFirstItemName(): Promise<string> {
        await this.firstItemName.waitFor({ state: 'visible' });
        return (await this.firstItemName.textContent())?.trim() ?? '';
    }

    async clickFirstItem(): Promise<void> {
        await this.firstViewDetailsLink.click();
    }
}

// Se añaden las definiciones de los elementos y los métodos correspondientes a acciones
// a medida que los voy necesitando.

