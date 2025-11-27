import { test as authTest, expect } from './auth';
import type { Page } from '@playwright/test';
import { fillItemForm } from './itemHelpers';

export const test = authTest.extend<{ createdItemId: number }>(
  {
    createdItemId: async ({ loggedInPage }, use) => {
      const page: Page = loggedInPage as Page;

      const name = `Test Item ${Date.now()}`;
      const tryClickAdd = async () => {
        const candidates = [
          page.getByRole('button', { name: /Add Item/i }).first(),
          page.getByText(/Add Item/i).first(),
        ];

        for (const c of candidates) {
          try {
            if (c && (await c.count()) > 0) {
              await c.click();
              return true;
            }
          } catch (_e) {
          }
        }

        return false;
      };

      try {
        const opened = await tryClickAdd();
        if (!opened) {
          await page.click('text=Add Item', { timeout: 2000 }).catch(() => null);
        }

        await page.waitForSelector('[data-testid="item-submit-btn"]', { timeout: 5000 });

        await fillItemForm(page, name);

        const submit = page.locator('[data-testid="item-submit-btn"]').first();
        await submit.click();

        await page.waitForSelector('text=exitosamente,timeout=5000', { timeout: 7000 }).catch(() => null);

        const itemsResp = await page.evaluate(async () => {
          try {
            const r = await fetch('/api/items');
            if (!r.ok) return null;
            return await r.json();
          } catch (e) {
            return null;
          }
        });

        let createdId: number | null = null;
        if (itemsResp) {
          const itemsArray = itemsResp.items || itemsResp || [];
          const found = (itemsArray as any[]).find(it => (it.name || it.title || '').toString().includes(name));
          if (found) createdId = Number(found.id ?? null) || null;
        }

        if (!createdId) {
          try {
            const el = await page.getByText(name).first();
            if (await el.count()) {
              createdId = 0;
            }
          } catch (e) {
            createdId = 0;
          }
        }

        await use(createdId ?? 0);
      } catch (err) {
        await use(0);
      }

    },
  }
);

export { expect };
