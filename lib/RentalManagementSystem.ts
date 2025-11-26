import fs from "fs";
import path from "path";

export type Category = "dress" | "shoes" | "bag" | "jacket";

function normalizeCategory(raw?: string | null): Category | undefined {
  if (!raw) return undefined;

  const map: Record<string, Category> = {
    dress: "dress",
    dresses: "dress",
    shoe: "shoes",
    shoes: "shoes",
    bag: "bag",
    bags: "bag",
    jacket: "jacket",
    jackets: "jacket",
  };

  const key = raw.toLowerCase();
  return map[key];
}

export type Item = {
  id: number;
  name: string;
  category: string;
  pricePerDay: number;
  sizes: string[];
  color: string;
  style?: string;
  description: string;
  images: string[];
  alt: string;
};

export type Rental = {
  id: string;
  itemId: number;
  start: string;
  end: string;
  customer: { name: string; email: string; phone: string };
  createdAt: string;
  status: "active" | "canceled";
};

// ----------------------------------------------------
// Filesystem config
// ----------------------------------------------------

const DATA_DIR = path.join(process.cwd(), "data");
const ITEMS_FILE = path.join(DATA_DIR, "items.json");
const RENTALS_FILE = path.join(DATA_DIR, "rentals.json");
const COLORS_FILE = path.join(DATA_DIR, "colors.json");

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (e) {
    console.error("Failed creating data directory", e);
  }
}

// ----------------------------------------------------
// ITEMS persistence
// ----------------------------------------------------

function readItemsFile(): Item[] {
  try {
    if (!fs.existsSync(ITEMS_FILE)) {
      ensureDataDir();
      const defaultItems: Item[] = [
        {
          id: 1,
          name: "Silk Evening Gown",
          category: "dress",
          pricePerDay: 79,
          sizes: ["XS", "S", "M", "L"],
          color: "champagne",
          style: "evening",
          description: "Luxurious silk gown with flattering silhouette.",
          images: ["/images/dresses/silk-evening-gown.jpg"],
          alt: "Model wearing a champagne silk evening gown",
        },
        {
          id: 2,
          name: "Black Tie Dress",
          category: "dress",
          pricePerDay: 99,
          sizes: ["S", "M", "L", "XL"],
          color: "black",
          style: "black-tie",
          description: "Elegant black-tie dress for formal events.",
          images: ["/images/dresses/black-tie-dress.jpg"],
          alt: "Elegant black tie dress",
        },
        {
          id: 3,
          name: "Floral Midi Dress",
          category: "dress",
          pricePerDay: 49,
          sizes: ["XS", "S", "M"],
          color: "floral",
          style: "daytime",
          description: "Bright floral midi for daytime events.",
          images: ["/images/dresses/floral-midi-dress.jpg"],
          alt: "Floral midi dress perfect for daytime events",
        },
        {
          id: 4,
          name: "Velvet Cocktail Dress",
          category: "dress",
          pricePerDay: 59,
          sizes: ["S", "M", "L"],
          color: "burgundy",
          style: "cocktail",
          description: "Rich velvet cocktail dress in deep tones.",
          images: ["/images/dresses/velvet-cocktail-dress.jpg"],
          alt: "Velvet cocktail dress in deep tones",
        },
      ];
      fs.writeFileSync(ITEMS_FILE, JSON.stringify(defaultItems, null, 2));
      return defaultItems;
    }

    const raw = fs.readFileSync(ITEMS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Failed to read items", e);
    return [];
  }
}

function writeItemsFile(items: Item[]) {
  try {
    ensureDataDir();
    fs.writeFileSync(ITEMS_FILE, JSON.stringify(items, null, 2));
  } catch (e) {
    console.error("Failed to write items file", e);
  }
}

// ----------------------------------------------------
// RENTALS persistence
// ----------------------------------------------------

function readRentalsFile(): Rental[] {
  try {
    if (!fs.existsSync(RENTALS_FILE)) {
      ensureDataDir();
      fs.writeFileSync(RENTALS_FILE, JSON.stringify([], null, 2));
      return [];
    }
    const raw = fs.readFileSync(RENTALS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Failed to read rentals file", e);
    return [];
  }
}

function writeRentalsFile(rentals: Rental[]) {
  try {
    ensureDataDir();
    fs.writeFileSync(RENTALS_FILE, JSON.stringify(rentals, null, 2));
  } catch (e) {
    console.error("Failed to write rentals file", e);
  }
}

// ----------------------------------------------------
// COLORS persistence
// ----------------------------------------------------

function readColorsFile(): string[] {
  try {
    if (!fs.existsSync(COLORS_FILE)) {
      ensureDataDir();
      const defaultColors = ["Champagne", "Black", "Floral", "Burgundy"];
      fs.writeFileSync(COLORS_FILE, JSON.stringify(defaultColors, null, 2));
      return defaultColors;
    }
    const raw = fs.readFileSync(COLORS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeColorsFile(colors: string[]) {
  try {
    ensureDataDir();
    fs.writeFileSync(COLORS_FILE, JSON.stringify(colors, null, 2));
  } catch (e) {
    console.error("Failed to write colors file", e);
  }
}

export function listColors() {
  return readColorsFile();
}

export function addColorOption(color: string) {
  const normalized = color.trim();
  if (!normalized) return { error: "Invalid color" as const };

  const colors = readColorsFile();
  const normalizedLower = normalized.toLowerCase();
  if (colors.some((c) => (c || "").toLowerCase() === normalizedLower))
    return { error: "Already exists" as const };

  colors.push(normalized);
  writeColorsFile(colors);
  return { ok: true, color: normalized } as const;
}

export function removeColorOption(color: string) {
  const normalized = color.trim();
  if (!normalized) return { error: "Invalid color" as const };

  const colors = readColorsFile();
  const normalizedLower = normalized.toLowerCase();
  const idx = colors.findIndex(
    (c) => (c || "").toLowerCase() === normalizedLower
  );
  if (idx === -1) return { error: "Not found" as const };

  colors.splice(idx, 1);
  writeColorsFile(colors);
  return { ok: true, color: normalized } as const;
}

// ----------------------------------------------------
// ITEM listing / filters
// ----------------------------------------------------

export function listItems(filters?: {
  q?: string;
  category?: string;
  size?: string;
  color?: string;
  style?: string;
  start?: string;
  end?: string;
  minPrice?: number;
  maxPrice?: number;
}) {
  const items = readItemsFile();
  const q = filters?.q ? filters.q.toLowerCase().trim() : "";
  const filterCategory = normalizeCategory(filters?.category ?? undefined);

  return items.filter((it) => {
    const itemCategory = normalizeCategory(it.category);

    if (filterCategory && itemCategory !== filterCategory) return false;

    if (filters?.size && !it.sizes.includes(filters.size)) return false;
    if (
      filters?.color &&
      it.color.toLowerCase() !== filters.color.toLowerCase()
    )
      return false;
    if (
      filters?.style &&
      (it.style ?? "").toLowerCase() !== filters.style.toLowerCase()
    )
      return false;
    if (
      typeof filters?.minPrice === "number" &&
      it.pricePerDay < filters.minPrice
    ) {
      return false;
    }
    if (
      typeof filters?.maxPrice === "number" &&
      it.pricePerDay > filters.maxPrice
    ) {
      return false;
    }
    if (filters?.start && filters?.end) {
      if (!isItemAvailable(it.id, filters.start, filters.end)) return false;
    }
    if (q) {
      const haystack = [it.name, it.color, it.style ?? "", it.category]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

export function getItem(id: number) {
  const items = readItemsFile();
  return items.find((i) => i.id === id) ?? null;
}

export function listItemIds() {
  const items = readItemsFile();
  return items.map((i) => i.id);
}

export function getItemRentals(itemId: number) {
  const rentals = readRentalsFile();
  return rentals.filter((r) => r.itemId === itemId && r.status === "active");
}

export function hasOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string
) {
  return !(aEnd < bStart || bEnd < aStart);
}

export function isItemAvailable(itemId: number, start: string, end: string) {
  const rs = getItemRentals(itemId);
  return rs.every((r) => !hasOverlap(start, end, r.start, r.end));
}

export function createRental(
  data: Omit<Rental, "id" | "createdAt" | "status">
) {
  const rentals = readRentalsFile();
  const items = readItemsFile();

  if (!items.find((i) => i.id === data.itemId))
    return { error: "Item not found" as const };

  const ok = rentals.every(
    (r) =>
      !(
        r.itemId === data.itemId &&
        hasOverlap(data.start, data.end, r.start, r.end) &&
        r.status === "active"
      )
  );

  if (!ok)
    return { error: "Item is not available for the selected dates." as const };

  const rental: Rental = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: "active",
  };

  rentals.push(rental);
  writeRentalsFile(rentals);

  return { rental };
}

export function listRentals() {
  return readRentalsFile().sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
}

export function cancelRental(id: string) {
  const rentals = readRentalsFile();
  const idx = rentals.findIndex((x) => x.id === id);
  if (idx === -1) return { error: "Not found" as const };

  rentals[idx].status = "canceled";
  writeRentalsFile(rentals);

  return { ok: true as const };
}

// ----------------------------------------------------
// CRUD: Items
// ----------------------------------------------------

export function addItem(itemData: Omit<Item, "id">) {
  try {
    const items = readItemsFile();
    const nextId = items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1;

    const newItem: Item = { id: nextId, ...itemData };
    items.push(newItem);
    writeItemsFile(items);

    return { item: newItem };
  } catch {
    return { error: "Failed to create item" as const };
  }
}

export function updateItem(id: number, updates: Partial<Omit<Item, "id">>) {
  const items = readItemsFile();
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return { error: "Item not found" };

  const activeRentals = getItemRentals(id);
  if (activeRentals.length > 0)
    return { error: "Cannot update item with active rentals" as const };

  try {
    items[index] = { ...items[index], ...updates };
    writeItemsFile(items);
    return { item: items[index] };
  } catch {
    return { error: "Failed to update item" as const };
  }
}

export function deleteItem(id: number) {
  const items = readItemsFile();
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return { error: "Item not found" as const };

  const activeRentals = getItemRentals(id);
  if (activeRentals.length > 0)
    return { error: "Cannot delete item with active rentals" as const };

  try {
    const deleted = items[index];
    items.splice(index, 1);
    writeItemsFile(items);
    return { item: deleted };
  } catch {
    return { error: "Failed to delete item" as const };
  }
}
