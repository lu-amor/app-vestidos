"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { AVAILABLE_STYLES } from "../../../lib/RentalManagementSystem";

type SearchParams = {
  q?: string;
  category?: string;
  size?: string;
  start?: string;
  end?: string;
  minPrice?: string;
  maxPrice?: string;
  color?: string;
  style?: string;
};

const SIZE_MAP: Record<string, string[]> = {
  dress: ["XS", "S", "M", "L", "XL", "XXL"],
  jacket: ["XS", "S", "M", "L", "XL", "XXL"],
  shoes: ["35", "36", "37", "38", "39", "40", "41", "42", "43"],
};

function sizeOptionsFor(category?: string) {
  if (!category) return [];
  return SIZE_MAP[category] || [];
}

export default function SearchFormClient({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const {
    q = "",
    category = "",
    size = "",
    minPrice = "",
    maxPrice = "",
    color = "",
    style = "",
  } = searchParams || {};

  const [cat, setCat] = useState<string>(category || "");
  const [sz, setSz] = useState<string>(size || "");
  const [st, setSt] = useState<string>(style || "");

  // Sync state when props change
  useEffect(() => {
    setCat(category || "");
    setSz(size || "");
    setSt(style || "");
  }, [category, size]);

  const options = sizeOptionsFor(cat);

  function onCategoryChange(e: ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    setCat(next);
    // Only clear the selected size if it's not available for the new category
    const nextOptions = sizeOptionsFor(next);
    if (!nextOptions.includes(sz)) {
      setSz("");
    }
    // Clear style when selecting a category that shouldn't use styles (bags)
    if (next === "bag") {
      setSt("");
    }
  }

  return (
    <form
      action="/search"
      method="GET"
      className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3"
    >
      <input
        name="q"
        defaultValue={q}
        placeholder="Search…"
        className="rounded-xl border px-3 py-2 text-sm"
      />

      <select
        name="category"
        defaultValue={cat}
        onChange={onCategoryChange}
        className="rounded-xl border px-3 py-2 text-sm"
      >
        <option value="">All categories</option>
        <option value="dress">Dresses</option>
        <option value="shoes">Shoes</option>
        <option value="bag">Bags</option>
        <option value="jacket">Jackets</option>
      </select>

      <label htmlFor="start" className="sr-only">
        Start date
      </label>
      <input
        id="start"
        name="start"
        type="date"
        defaultValue={searchParams.start}
        className="rounded-xl border px-3 py-2 text-sm"
      />

      <label htmlFor="end" className="sr-only">
        End date
      </label>
      <input
        id="end"
        name="end"
        type="date"
        defaultValue={searchParams.end}
        className="rounded-xl border px-3 py-2 text-sm"
      />

      <select
        name="size"
        value={sz}
        onChange={(e) => setSz(e.target.value)}
        disabled={options.length === 0}
        aria-disabled={options.length === 0}
        className={
          "rounded-xl border px-3 py-2 text-sm " +
          (options.length === 0 ? "opacity-50 cursor-not-allowed" : "")
        }
      >
        <option value="">
          {options.length === 0 ? "No sizes" : "Any size"}
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <input
        name="minPrice"
        defaultValue={minPrice}
        placeholder="Min price"
        className="rounded-xl border px-3 py-2 text-sm"
      />
      <input
        name="maxPrice"
        defaultValue={maxPrice}
        placeholder="Max price"
        className="rounded-xl border px-3 py-2 text-sm"
      />

      <input
        name="color"
        defaultValue={color}
        placeholder="Color"
        className="rounded-xl border px-3 py-2 text-sm"
      />

      <label htmlFor="style" className="sr-only">
        Style
      </label>
      <select
        id="style"
        name="style"
        value={st}
        onChange={(e) => setSt(e.target.value)}
        aria-disabled={cat === "bag"}
        disabled={cat === "bag"}
        className={
          "rounded-xl border px-3 py-2 text-sm " +
          (cat === "bag" ? "opacity-50 cursor-not-allowed" : "")
        }
      >
        <option value="">Any style</option>
        {AVAILABLE_STYLES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <button className="rounded-xl bg-fuchsia-600 text-white px-4 py-2 text-sm">
        Search
      </button>
    </form>
  );
}
