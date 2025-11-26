import fs from "fs";
import path from "path";
import { test, expect } from "@playwright/test";
import { CatalogPage } from "./pages/catalogPage";

const dataDir = path.join(process.cwd(), "data");
const itemsFile = path.join(dataDir, "items.json");
const rentalsFile = path.join(dataDir, "rentals.json");

function writeData(items: any[], rentals: any[]) {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(itemsFile, JSON.stringify(items, null, 2), "utf8");
  fs.writeFileSync(rentalsFile, JSON.stringify(rentals, null, 2), "utf8");
}

let originalItemsContent: string | null = null;
let originalRentalsContent: string | null = null;
let hadItemsFile = false;
let hadRentalsFile = false;

test.describe
  .serial("Catálogo - flujo completo de interacción con filtros", () => {
  test.beforeAll(() => {
    if (fs.existsSync(itemsFile)) {
      hadItemsFile = true;
      originalItemsContent = fs.readFileSync(itemsFile, "utf8");
    }
    if (fs.existsSync(rentalsFile)) {
      hadRentalsFile = true;
      originalRentalsContent = fs.readFileSync(rentalsFile, "utf8");
    }

    const placeholder = "/images/dresses/placeholder-test.png";

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
        images: [placeholder],
        alt: "Red Dress A",
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
        images: [placeholder],
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
        images: [placeholder],
        alt: "Cheap Item",
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
        images: [placeholder],
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
        images: [placeholder],
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
        description: "Too expensive",
        images: [placeholder],
        alt: "Too Expensive",
      },

      {
        id: 10,
        name: "Available A",
        category: "dress",
        pricePerDay: 4000,
        sizes: ["M"],
        color: "White",
        style: "Classic",
        description: "Available A",
        images: [placeholder],
        alt: "Available A",
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
        images: [placeholder],
        alt: "Booked B",
      },

      {
        id: 20,
        name: "Dress A Combined",
        category: "dress",
        pricePerDay: 5000,
        sizes: ["M"],
        color: "Red",
        style: "Classic",
        description: "Debe pasar combinación",
        images: [placeholder],
        alt: "Dress A Combined",
      },
      {
        id: 21,
        name: "Dress B Combined",
        category: "dress",
        pricePerDay: 5000,
        sizes: ["M"],
        color: "Red",
        style: "Casual",
        description: "No debe aparecer por estilo",
        images: [placeholder],
        alt: "Dress B Combined",
      },
      {
        id: 22,
        name: "Dress C Combined",
        category: "dress",
        pricePerDay: 9000,
        sizes: ["M"],
        color: "Red",
        style: "Classic",
        description: "No debe aparecer por precio",
        images: [placeholder],
        alt: "Dress C Combined",
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
        images: [placeholder],
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
        images: [placeholder],
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
        images: [placeholder],
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
        images: [placeholder],
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
        images: [placeholder],
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
        images: [placeholder],
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
        images: [placeholder],
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

  test.afterAll(() => {
    try {
      if (hadItemsFile && originalItemsContent !== null) {
        fs.writeFileSync(itemsFile, originalItemsContent, "utf8");
      } else if (!hadItemsFile && fs.existsSync(itemsFile)) {
        fs.unlinkSync(itemsFile);
      }

      if (hadRentalsFile && originalRentalsContent !== null) {
        fs.writeFileSync(rentalsFile, originalRentalsContent, "utf8");
      } else if (!hadRentalsFile && fs.existsSync(rentalsFile)) {
        fs.unlinkSync(rentalsFile);
      }
    } catch (err) {
      console.error("Error restaurando datos originales de test:", err);
    }
  });

  let catalog: CatalogPage;

  test.beforeEach(async ({ page }) => {
    catalog = new CatalogPage(page);
    await catalog.goto();
  });

  test("Búsqueda por color", async () => {
    await catalog.setColor("Red");
    await catalog.submit();

    const count = await catalog.getCardsCount();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const color = await catalog.getCardColorByIndex(i);
      expect(color).toBe("Red");
    }
  });

  test("Búsqueda sin resultados", async () => {
    await catalog.setQuery("zzzz-no-existe-xyz-123-@@");
    await catalog.submit();

    await expect(catalog.cards).toHaveCount(0);
    await expect(catalog.getNoResultsMessage()).toBeVisible();
  });

  test("Filtro por disponibilidad en fechas", async () => {
    await catalog.setDateRange("2025-10-12", "2025-10-14");
    await catalog.submit();

    await expect(catalog.getItemByName("Available A")).toBeVisible();
    await expect(catalog.getItemByName("Booked B")).toHaveCount(0);
  });

  test("Rango de precios con límites", async () => {
    const min = "1000";
    const max = "20000";

    await catalog.setPriceRange(min, max);
    await catalog.submit();

    await expect(catalog.getItemByName("Edge Low")).toBeVisible();
    await expect(catalog.getItemByName("Edge High")).toBeVisible();
    await expect(catalog.getItemByName("Cheap Item")).toHaveCount(0);
    await expect(catalog.getItemByName("Too Expensive")).toHaveCount(0);
  });

  test("Vestidos: combinación de filtros", async () => {
    await catalog.setCategory("dress");
    await catalog.setSize("M");
    await catalog.setColor("Red");
    await catalog.setStyle("Classic");

    await catalog.setPriceRange("3000", "7000");
    await catalog.setDateRange("2025-11-01", "2025-11-05");

    await catalog.submit();

    await expect(catalog.getItemByName("Dress A Combined")).toBeVisible();
    await expect(catalog.getItemByName("Dress B Combined")).toHaveCount(0);
    await expect(catalog.getItemByName("Dress C Combined")).toHaveCount(0);
  });

  test("Zapatos: combinación de filtros", async () => {
    await catalog.setCategory("shoes");
    await catalog.setSize("38");
    await catalog.setColor("Black");

    await catalog.setPriceRange("4000", "6000");
    await catalog.setDateRange("2025-12-12", "2025-12-15");

    await catalog.submit();

    await expect(catalog.getItemByName("Zapato A")).toBeVisible();
    await expect(catalog.getItemByName("Zapato B")).toHaveCount(0);
    await expect(catalog.getItemByName("Zapato C")).toHaveCount(0);
  });

  test("Carteras/Bolsos: combinación de filtros", async () => {
    await catalog.setCategory("bag");
    await catalog.setColor("Champagne");

    await catalog.setPriceRange("7000", "9000");
    await catalog.setDateRange("2026-01-06", "2026-01-08");

    await catalog.submit();

    await expect(catalog.getItemByName("Cartera A")).toBeVisible();
    await expect(catalog.getItemByName("Cartera B")).toHaveCount(0);
  });

  test("Chaquetas: combinación de filtros", async () => {
    await catalog.setCategory("jacket");
    await catalog.setSize("M");
    await catalog.setColor("Black");
    await catalog.setStyle("Formal");

    await catalog.setPriceRange("9000", "11000");
    await catalog.setDateRange("2026-03-16", "2026-03-18");

    await catalog.submit();

    await expect(catalog.getItemByName("Chaqueta A")).toBeVisible();
    await expect(catalog.getItemByName("Chaqueta B")).toHaveCount(0);
  });
});
