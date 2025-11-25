export type Category = "dress" | "shoes" | "bag" | "jacket";

export type Item = {
  id: number;
  name: string;
  category: Category;
  pricePerDay: number;
  sizes: string[]; // for shoes you can use "36-41"
  color: string;
  style?: string;
  description: string;
  images: string[];
  alt: string;
};

export type Rental = {
  id: string;
  itemId: number;
  start: string; // ISO date (yyyy-mm-dd)
  end: string;   // ISO date (yyyy-mm-dd)
  customer: { name: string; email: string; phone: string };
  createdAt: string;
  status: "active" | "canceled";
};

// File-backed store for demo items. This keeps items consistent across server handlers.
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const ITEMS_FILE = path.join(DATA_DIR, 'items.json');
const RENTALS_FILE = path.join(DATA_DIR, 'rentals.json');

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
  } catch (e) {
    // ignore
  }
}

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
    const raw = fs.readFileSync(ITEMS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch (e) {
    console.error('Failed to read items file', e);
    return [];
  }
}

function writeItemsFile(data: Item[]) {
  try {
    ensureDataDir();
    fs.writeFileSync(ITEMS_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Failed to write items file', e);
  }
}

function readRentalsFile(): Rental[] {
  try {
    if (!fs.existsSync(RENTALS_FILE)) {
      ensureDataDir();
      fs.writeFileSync(RENTALS_FILE, JSON.stringify([], null, 2));
      return [];
    }
    const raw = fs.readFileSync(RENTALS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch (e) {
    console.error('Failed to read rentals file', e);
    return [];
  }
}

function writeRentalsFile(data: Rental[]) {
  try {
    ensureDataDir();
    fs.writeFileSync(RENTALS_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Failed to write rentals file', e);
  }
}

// File-backed catalog for filter options so state persists across serverless handlers
const COLORS_FILE = path.join(DATA_DIR, 'colors.json');

function readColorsFile(): string[] {
  try {
    if (!fs.existsSync(COLORS_FILE)) {
      ensureDataDir();
      const defaultColors = ['Champagne', 'Black', 'Floral', 'Burgundy'];
      fs.writeFileSync(COLORS_FILE, JSON.stringify(defaultColors, null, 2));
      return defaultColors;
    }
    const raw = fs.readFileSync(COLORS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch (e) {
    console.error('Failed to read colors file', e);
    return [];
  }
}

function writeColorsFile(colors: string[]) {
  try {
    ensureDataDir();
    fs.writeFileSync(COLORS_FILE, JSON.stringify(colors, null, 2));
  } catch (e) {
    console.error('Failed to write colors file', e);
  }
}

export function listColors() {
  return readColorsFile();
}

export function addColorOption(color: string) {
  const normalized = (color || '').toString().trim();
  if (!normalized) return { error: 'Invalid color' as const };
  const colors = readColorsFile();
  if (colors.find(c => c.toLowerCase() === normalized.toLowerCase())) {
    return { error: 'Already exists' as const };
  }
  colors.push(normalized);
  writeColorsFile(colors);
  return { ok: true as const, color: normalized };
}

export function removeColorOption(color: string) {
  const normalized = (color || '').toString().trim();
  if (!normalized) return { error: 'Invalid color' as const };
  const colors = readColorsFile();
  const idx = colors.findIndex(c => c.toLowerCase() === normalized.toLowerCase());
  if (idx === -1) return { error: 'Not found' as const };
  colors.splice(idx, 1);
  writeColorsFile(colors);
  return { ok: true as const, color: normalized };
}

export function listItems(filters?: {
  q?: string;
  category?: Category;
  size?: string;
  color?: string;
  style?: string;
}) {
  const q = filters?.q?.toLowerCase().trim();
  const items = readItemsFile();
  return items.filter((it) => {
    if (filters?.category && it.category !== filters.category) return false;
    if (filters?.size && !it.sizes.includes(filters.size)) return false;
    if (filters?.color && it.color.toLowerCase() !== filters.color.toLowerCase()) return false;
    if (filters?.style && (it.style ?? "").toLowerCase() !== filters.style.toLowerCase()) return false;
    if (q) {
      const hay = [it.name, it.color, it.style ?? "", it.category].join(" ").toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export function getItem(id: number) {
  const items = readItemsFile();
  return items.find((i) => i.id === id) ?? null;
}

export function getItemRentals(itemId: number) {
  const rentals = readRentalsFile();
  return rentals.filter((r) => r.itemId === itemId && r.status === "active");
}

export function hasOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string) {
  return !(aEnd < bStart || bEnd < aStart);
}

export function isItemAvailable(itemId: number, start: string, end: string) {
  const rs = getItemRentals(itemId);
  return rs.every((r) => !hasOverlap(start, end, r.start, r.end));
}

export function createRental(data: Omit<Rental, "id" | "createdAt" | "status">) {
  // Read current rentals and items
  const rentals = readRentalsFile();
  const items = readItemsFile();
  // ensure item exists
  if (!items.find(i => i.id === data.itemId)) return { error: 'Item not found' as const };
  // check availability
  const ok = rentals.every((r) => !(r.itemId === data.itemId && hasOverlap(data.start, data.end, r.start, r.end) && r.status === 'active'));
  if (!ok) return { error: "Item is not available for the selected dates." as const };
  const id = crypto.randomUUID();
  const rental: Rental = { ...data, id, createdAt: new Date().toISOString(), status: "active" };
  rentals.push(rental);
  writeRentalsFile(rentals);
  return { rental };
}

export function listRentals() {
  const rentals = readRentalsFile();
  return rentals.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function cancelRental(id: string) {
  const rentals = readRentalsFile();
  const idx = rentals.findIndex(x => x.id === id);
  if (idx === -1) return { error: "Not found" as const };
  rentals[idx].status = 'canceled';
  writeRentalsFile(rentals);
  return { ok: true as const };
}

// Funciones de ABM para items
export function addItem(itemData: Omit<Item, 'id'>) {
  try {
    const items = readItemsFile();
    const nextId = (items.length === 0) ? 1 : (Math.max(...items.map(i => i.id)) + 1);
    const newItem: Item = { id: nextId, ...itemData };
    items.push(newItem);
    writeItemsFile(items);
    return { item: newItem };
  } catch (error) {
    return { error: "Failed to create item" as const };
  }
}

export function updateItem(id: number, updates: Partial<Omit<Item, 'id'>>) {
  const items = readItemsFile();
  const index = items.findIndex(i => i.id === id);
  if (index === -1) return { error: "Item not found" as const };
  // Verificar si el item tiene alquileres activos
  const activeRentals = getItemRentals(id);
  if (activeRentals.length > 0) {
    return { error: "Cannot update item with active rentals" as const };
  }
  try {
    items[index] = { ...items[index], ...updates };
    writeItemsFile(items);
    return { item: items[index] };
  } catch (error) {
    return { error: "Failed to update item" as const };
  }
}

export function deleteItem(id: number) {
  const items = readItemsFile();
  const index = items.findIndex(i => i.id === id);
  if (index === -1) return { error: "Item not found" as const };
  // Verificar si el item tiene alquileres activos
  const activeRentals = getItemRentals(id);
  if (activeRentals.length > 0) {
    return { error: "Cannot delete item with active rentals" as const };
  }
  try {
    const deletedItem = items[index];
    items.splice(index, 1);
    writeItemsFile(items);
    return { item: deletedItem };
  } catch (error) {
    return { error: "Failed to delete item" as const };
  }
}
