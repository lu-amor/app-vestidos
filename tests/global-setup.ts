import fs from 'fs/promises';
import path from 'path';

export default async function globalSetup() {
  const root = path.resolve(__dirname, '..'); // repo root
  const dataDir = path.join(root, 'data');

  const items = [
    {
      "id": 1,
      "name": "Silk Evening Gown",
      "category": "dress",
      "pricePerDay": 79,
      "sizes": ["XS","S","M","L"],
      "color": "champagne",
      "style": "evening",
      "description": "Luxurious silk gown with flattering silhouette.",
      "images": ["/images/dresses/silk-evening-gown.jpg"],
      "alt": "Model wearing a champagne silk evening gown"
    },
    {
      "id": 2,
      "name": "Black Tie Dress",
      "category": "dress",
      "pricePerDay": 99,
      "sizes": ["S","M","L","XL"],
      "color": "black",
      "style": "black-tie",
      "description": "Elegant black-tie dress for formal events.",
      "images": ["/images/dresses/black-tie-dress.jpg"],
      "alt": "Elegant black tie dress"
    },
    {
      "id": 3,
      "name": "Floral Midi Dress",
      "category": "dress",
      "pricePerDay": 49,
      "sizes": ["XS","S","M"],
      "color": "floral",
      "style": "daytime",
      "description": "Bright floral midi for daytime events.",
      "images": ["/images/dresses/floral-midi-dress.jpg"],
      "alt": "Floral midi dress perfect for daytime events"
    },
    {
      "id": 4,
      "name": "Velvet Cocktail Dress",
      "category": "dress",
      "pricePerDay": 59,
      "sizes": ["S","M","L"],
      "color": "burgundy",
      "style": "cocktail",
      "description": "Rich velvet cocktail dress in deep tones.",
      "images": ["/images/dresses/velvet-cocktail-dress.jpg"],
      "alt": "Velvet cocktail dress in deep tones"
    }
  ];

  const rentals: any[] = [];

await fs.rm(path.join(dataDir, 'items.json'), { force: true });
await fs.rm(path.join(dataDir, 'rentals.json'), { force: true });

await fs.mkdir(dataDir, { recursive: true });
await fs.writeFile(path.join(dataDir, 'items.json'), JSON.stringify(items, null, 2));
await fs.writeFile(path.join(dataDir, 'rentals.json'), JSON.stringify(rentals, null, 2));
}