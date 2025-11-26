import fs from "fs";
import path from "path";
import { test, expect, Page } from "@playwright/test";

const dataDir = path.join(process.cwd(), "data");
const itemsFile = path.join(dataDir, "items.json");
const rentalsFile = path.join(dataDir, "rentals.json");
const colorsFile = path.join(dataDir, "colors.json");

function writeData(items: any[], rentals: any[]) {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(itemsFile, JSON.stringify(items, null, 2), "utf8");
  fs.writeFileSync(rentalsFile, JSON.stringify(rentals, null, 2), "utf8");
  const colors = Array.from(new Set(items.map((i) => i.color))).filter(Boolean);
  fs.writeFileSync(colorsFile, JSON.stringify(colors, null, 2), "utf8");
}

async function selectOptionByText(
  page: Page,
  name: string,
  textFragment: string
): Promise<string> {
  const select = page.locator(`select[name="${name}"]`);
  await select.waitFor({ state: "visible" });
  const options = select.locator("option");
  const count = await options.count();

  for (let i = 0; i < count; i++) {
    const opt = options.nth(i);
    const label = (await opt.textContent())?.trim() ?? "";
    const value = (await opt.getAttribute("value")) ?? "";
    if (!value) continue;
    if (label.includes(textFragment)) {
      await select.selectOption(value);
      return value;
    }
  }
  throw new Error(
    `No option with text containing "${textFragment}" in select[name="${name}"]`
  );
}

test.describe("Catálogo - flujo completo de interacción con filtros", () => {
  test.beforeAll(() => {
    const items = [
      {
        id: 1,
        name: "Red Dress A",
        category: "dress",
        pricePerDay: 5000,
        sizes: ["M"],
        color: "Red",
        style: "Classic",
        description: "A red classic dress",
        images: ["/images/dresses/1.jpg"],
        alt: "Red Dress",
      },
      {
        id: 2,
        name: "Gold Bag",
        category: "bag",
        pricePerDay: 8000,
        sizes: [],
        color: "Gold",
        style: "Glamorous",
        description: "Golden bag",
        images: ["/images/dresses/2.jpg"],
        alt: "Gold Bag",
      },
      {
        id: 3,
        name: "Red Dress B",
        category: "dress",
        pricePerDay: 9000,
        sizes: ["S"],
        color: "Red",
        style: "Casual",
        description: "Red casual",
        images: ["/images/dresses/3.jpg"],
        alt: "Red Dress B",
      },
      {
        id: 4,
        name: "Cheap Item",
        category: "dress",
        pricePerDay: 800,
        sizes: ["M"],
        color: "Blue",
        style: "Casual",
        description: "Cheap",
        images: ["/images/dresses/4.jpg"],
        alt: "Cheap",
      },
      {
        id: 5,
        name: "Edge Low",
        category: "dress",
        pricePerDay: 1000,
        sizes: ["L"],
        color: "Green",
        style: "Classic",
        description: "Edge low",
        images: ["/images/dresses/5.jpg"],
        alt: "Edge Low",
      },
      {
        id: 6,
        name: "Edge High",
        category: "dress",
        pricePerDay: 20000,
        sizes: ["L"],
        color: "Green",
        style: "Classic",
        description: "Edge high",
        images: ["/images/dresses/6.jpg"],
        alt: "Edge High",
      },
      {
        id: 7,
        name: "Too Expensive",
        category: "dress",
        pricePerDay: 21000,
        sizes: ["L"],
        color: "Black",
        style: "Formal",
        description: "Expensive",
        images: ["/images/dresses/7.jpg"],
        alt: "Expensive",
      },
      {
        id: 10,
        name: "Available A",
        category: "dress",
        pricePerDay: 4000,
        sizes: ["M"],
        color: "White",
        style: "Classic",
        description: "Avail A",
        images: ["/images/dresses/10.jpg"],
        alt: "A",
      },
      {
        id: 11,
        name: "Booked B",
        category: "dress",
        pricePerDay: 4500,
        sizes: ["M"],
        color: "White",
        style: "Classic",
        description: "Booked B",
        images: ["/images/dresses/11.jpg"],
        alt: "B",
      },
      {
        id: 20,
        name: "Dress A Combined",
        category: "dress",
        pricePerDay: 5000,
        sizes: ["M"],
        color: "Red",
        style: "Classic",
        description: "",
        images: ["/images/dresses/20.jpg"],
        alt: "DA",
      },
      {
        id: 21,
        name: "Dress B Combined",
        category: "dress",
        pricePerDay: 5000,
        sizes: ["M"],
        color: "Red",
        style: "Casual",
        description: "",
        images: ["/images/dresses/21.jpg"],
        alt: "DB",
      },
      {
        id: 22,
        name: "Dress C Combined",
        category: "dress",
        pricePerDay: 9000,
        sizes: ["S"],
        color: "Red",
        style: "Classic",
        description: "",
        images: ["/images/dresses/22.jpg"],
        alt: "DC",
      },
      {
        id: 30,
        name: "Zapato A",
        category: "shoes",
        pricePerDay: 5000,
        sizes: ["38"],
        color: "Black",
        style: "Casual",
        description: "Zapato A",
        images: ["/images/dresses/30.jpg"],
        alt: "Zapato A",
      },
      {
        id: 31,
        name: "Zapato B",
        category: "shoes",
        pricePerDay: 5000,
        sizes: ["38"],
        color: "Red",
        style: "Casual",
        description: "Zapato B",
        images: ["/images/dresses/31.jpg"],
        alt: "Zapato B",
      },
      {
        id: 32,
        name: "Zapato C",
        category: "shoes",
        pricePerDay: 7000,
        sizes: ["39"],
        color: "Black",
        style: "Casual",
        description: "Zapato C",
        images: ["/images/dresses/32.jpg"],
        alt: "Zapato C",
      },
      {
        id: 40,
        name: "Cartera A",
        category: "bag",
        pricePerDay: 8000,
        sizes: [],
        color: "Champagne",
        style: "Glamorous",
        description: "Cartera A",
        images: ["/images/dresses/40.jpg"],
        alt: "Cartera A",
      },
      {
        id: 41,
        name: "Cartera B",
        category: "bag",
        pricePerDay: 8000,
        sizes: [],
        color: "Black",
        style: "Glamorous",
        description: "Cartera B",
        images: ["/images/dresses/41.jpg"],
        alt: "Cartera B",
      },
      {
        id: 50,
        name: "Chaqueta A",
        category: "jacket",
        pricePerDay: 10000,
        sizes: ["M"],
        color: "Black",
        style: "Formal",
        description: "Chaqueta A",
        images: ["/images/dresses/50.jpg"],
        alt: "Chaqueta A",
      },
      {
        id: 51,
        name: "Chaqueta B",
        category: "jacket",
        pricePerDay: 10000,
        sizes: ["M"],
        color: "Black",
        style: "Casual",
        description: "Chaqueta B",
        images: ["/images/dresses/51.jpg"],
        alt: "Chaqueta B",
      },
    ];

    const rentals = [
      {
        id: "r1",
        itemId: 11,
        start: "2025-10-12",
        end: "2025-10-15",
        customer: { name: "X", email: "x@x.com", phone: "" },
        createdAt: new Date().toISOString(),
        status: "active",
      },
    ];

    writeData(items, rentals);
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("/search");
    await page.waitForSelector('select[name="category"]', { state: "visible" });
  });

  test("CP-001 - Búsqueda por color (RF-001)", async ({ page }) => {
    await selectOptionByText(page, "color", "Red");
    await page.getByRole("button", { name: /search/i }).click();

    const cards = page.getByTestId("item-card");
    await expect(cards.first()).toBeVisible();

    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const color = (await cards.nth(i).getAttribute("data-color")) ?? "";
      expect(color).toBe("Red");
    }
  });

  test("CP-002 - Búsqueda sin resultados (RF-001)", async ({ page }) => {
    await page.fill('input[name="q"]', "zzzz-no-existe-xyz-123-@@");
    await page.getByRole("button", { name: /search/i }).click();

    await expect(page.getByTestId("item-card")).toHaveCount(0);
    await expect(page.getByText("No items match your filters.")).toBeVisible();
  });

  test("CP-020 - Filtro por disponibilidad en fechas (RNF-011)", async ({
    page,
  }) => {
    await page.fill('input[name="start"]', "2025-10-12");
    await page.fill('input[name="end"]', "2025-10-14");
    await page.getByRole("button", { name: /search/i }).click();

    await expect(page.getByText("Available A")).toBeVisible();
    await expect(page.getByText("Booked B")).toHaveCount(0);
  });

  test("CP-021 - Rango de precios con límites (RNF-012)", async ({ page }) => {
    const min = 1000;
    const max = 20000;

    await page.fill('input[name="minPrice"]', String(min));
    await page.fill('input[name="maxPrice"]', String(max));
    await page.getByRole("button", { name: /search/i }).click();

    await expect(page.getByText("Edge Low")).toBeVisible();
    await expect(page.getByText("Edge High")).toBeVisible();
    await expect(page.getByText("Cheap Item")).toHaveCount(0);
    await expect(page.getByText("Too Expensive")).toHaveCount(0);
  });

  test("CP-024 - Vestidos: combinación de filtros (RF-014)", async ({
    page,
  }) => {
    await selectOptionByText(page, "category", "Dresses");
    await selectOptionByText(page, "size", "M");
    await selectOptionByText(page, "color", "Red");
    await selectOptionByText(page, "style", "Classic");

    await page.fill('input[name="minPrice"]', "3000");
    await page.fill('input[name="maxPrice"]', "7000");
    await page.fill('input[name="start"]', "2025-11-01");
    await page.fill('input[name="end"]', "2025-11-05");

    await page.getByRole("button", { name: /search/i }).click();

    await expect(page.getByText("Dress A Combined")).toBeVisible();
    await expect(page.getByText("Dress B Combined")).toHaveCount(0);
    await expect(page.getByText("Dress C Combined")).toHaveCount(0);
  });

  test("CP-025 - Zapatos: combinación de filtros (RF-015)", async ({
    page,
  }) => {
    await selectOptionByText(page, "category", "Shoes");
    await selectOptionByText(page, "size", "38");
    await selectOptionByText(page, "color", "Black");

    await page.fill('input[name="minPrice"]', "4000");
    await page.fill('input[name="maxPrice"]', "6000");
    await page.fill('input[name="start"]', "2025-12-12");
    await page.fill('input[name="end"]', "2025-12-15");

    await page.getByRole("button", { name: /search/i }).click();

    await expect(page.getByText("Zapato A")).toBeVisible();
    await expect(page.getByText("Zapato B")).toHaveCount(0);
    await expect(page.getByText("Zapato C")).toHaveCount(0);
  });

  test("CP-026 - Carteras/Bolsos: combinación de filtros (RF-016)", async ({
    page,
  }) => {
    await selectOptionByText(page, "category", "Bags");
    await selectOptionByText(page, "color", "Champagne");

    await page.fill('input[name="minPrice"]', "7000");
    await page.fill('input[name="maxPrice"]', "9000");
    await page.fill('input[name="start"]', "2026-01-06");
    await page.fill('input[name="end"]', "2026-01-08");

    await page.getByRole("button", { name: /search/i }).click();

    await expect(page.getByText("Cartera A")).toBeVisible();
    await expect(page.getByText("Cartera B")).toHaveCount(0);
  });

  test("CP-028 - Chaquetas: combinación de filtros (RF-017)", async ({
    page,
  }) => {
    await selectOptionByText(page, "category", "Jackets");
    await selectOptionByText(page, "size", "M");
    await selectOptionByText(page, "color", "Black");
    await selectOptionByText(page, "style", "Formal");

    await page.fill('input[name="minPrice"]', "9000");
    await page.fill('input[name="maxPrice"]', "11000");
    await page.fill('input[name="start"]', "2026-03-16");
    await page.fill('input[name="end"]', "2026-03-18");

    await page.getByRole("button", { name: /search/i }).click();

    await expect(page.getByText("Chaqueta A")).toBeVisible();
    await expect(page.getByText("Chaqueta B")).toHaveCount(0);
  });
});
