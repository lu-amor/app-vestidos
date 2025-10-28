import { test } from '@playwright/test';
import { HomePage } from './pages/HomePage';
import { ItemPage } from './pages/ItemPage';

test('clicking a featured dress from home opens item details page', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    const itemName = await home.getFirstItemName();

    await home.clickFirstItem();

    const item = new ItemPage(page);
    await item.expectVisibleWithName(itemName);
    await item.expectUrlIsForItem();
});
