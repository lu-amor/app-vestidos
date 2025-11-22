import fs from 'fs';
import path from 'path';

export type Category = "dress" | "shoes" | "bag" | "jacket";

export type Item = {
  id: number;
  name: string;
  category: Category;
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
  start: string; // ISO date (yyyy-mm-dd)
  end: string;   // ISO date (yyyy-mm-dd)
  customer: { name: string; email: string; phone: string };
  createdAt: string;
  status: "active" | "canceled";
};

// Los vestidos se persisten en data/items.json para consistencia entre las páginas

const DATA_DIR = path.join(process.cwd(), 'data');
const ITEMS_FILE = path.join(DATA_DIR, 'items.json');

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (e) {
    console.error('Failed creating data dir:', e);
  }
}

function saveItemsToFile(itemsToSave: Item[]) {
  try {
    ensureDataDir();
    fs.writeFileSync(ITEMS_FILE, JSON.stringify(itemsToSave, null, 2), { encoding: 'utf8' });
  } catch (e) {
    console.error('Failed to save items to file:', e);
  }
}
function readItemsSync(): Item[] {
  try {
    if (fs.existsSync(ITEMS_FILE)) {
      const raw = fs.readFileSync(ITEMS_FILE, { encoding: 'utf8' });
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as Item[];
    }
  } catch (e) {
    console.error('Failed to read items file, falling back to empty list:', e);
  }
  try {
    ensureDataDir();
    fs.writeFileSync(ITEMS_FILE, JSON.stringify([], null, 2), { encoding: 'utf8' });
  } catch (e) {
    console.error('Failed to write empty items file:', e);
  }
  return [];
}

let items: Item[] = readItemsSync();

let rentals: Rental[] = [];

export function listItems(filters?: {
  q?: string;
  category?: Category;
  size?: string;
  color?: string;
  style?: string;
}) {
  const current = readItemsSync();
  const q = filters?.q?.toLowerCase().trim();
  return current.filter((it) => {
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
  const current = readItemsSync();
  return current.find((i) => i.id === id) ?? null;
}

export function getItemRentals(itemId: number) {
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
  const ok = isItemAvailable(data.itemId, data.start, data.end);
  if (!ok) return { error: "Item is not available for the selected dates." as const };
  const id = crypto.randomUUID();
  const rental: Rental = { ...data, id, createdAt: new Date().toISOString(), status: "active" };
  rentals.push(rental);
  return { rental };
}

export function listRentals() {
  return rentals.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function cancelRental(id: string) {
  const r = rentals.find((x) => x.id === id);
  if (!r) return { error: "Not found" as const };
  r.status = "canceled";
  return { ok: true as const };
}

// Funciones de ABM para items
export function addItem(itemData: Omit<Item, 'id'>) {
  try {
    const current = readItemsSync();
    const nextId = Math.max(...current.map(i => i.id), 0) + 1;
    const newItem: Item = { id: nextId, ...itemData };
    current.push(newItem);
    saveItemsToFile(current);
    return { item: newItem };
  } catch (error) {
    return { error: "Failed to create item" as const };
  }
}

export function updateItem(id: number, updates: Partial<Omit<Item, 'id'>>) {
  const current = readItemsSync();
  const index = current.findIndex(i => i.id === id);
  if (index === -1) return { error: "Item not found" as const };

  // Verificar si el item tiene alquileres activos
  const activeRentals = getItemRentals(id);
  if (activeRentals.length > 0) {
    return { error: "Cannot update item with active rentals" as const };
  }

  try {
    current[index] = { ...current[index], ...updates };
    saveItemsToFile(current);
    return { item: current[index] };
  } catch (error) {
    return { error: "Failed to update item" as const };
  }
}

export function deleteItem(id: number) {
  const current = readItemsSync();
  const index = current.findIndex(i => i.id === id);
  if (index === -1) return { error: "Item not found" as const };

  // Verificar si el item tiene alquileres activos
  const activeRentals = getItemRentals(id);
  if (activeRentals.length > 0) {
    return { error: "Cannot delete item with active rentals" as const };
  }

  try {
    const deletedItem = current[index];
    current.splice(index, 1);
    saveItemsToFile(current);
    return { item: deletedItem };
  } catch (error) {
    return { error: "Failed to delete item" as const };
  }
}
