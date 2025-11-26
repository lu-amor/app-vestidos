"use client";

import React, { useEffect, useState } from "react";
import { STYLE_OPTIONS, COLOR_OPTIONS } from "../../lib/constants";

type Defaults = {
  q?: string;
  category?: string;
  size?: string;
  color?: string;
  style?: string;
  start?: string;
  end?: string;
  minPrice?: string;
  maxPrice?: string;
};

export default function SearchFilters({
  defaults = {},
  buttonText = "Search dresses",
  compact = false,
}: {
  defaults?: Defaults;
  buttonText?: string;
  compact?: boolean;
}) {
  const {
    q = "",
    category = "",
    size = "",
    color = "",
    style = "",
    start = "",
    end = "",
    minPrice = "",
    maxPrice = "",
  } = defaults;

  const [qText, setQText] = useState<string>(q);
  const [cat, setCat] = useState<string>(category);
  const [selectedSize, setSelectedSize] = useState<string>(size);
  const [minP, setMinP] = useState<string>(minPrice);
  const [maxP, setMaxP] = useState<string>(maxPrice);

  useEffect(() => setQText(q), [q]);
  useEffect(() => setCat(category), [category]);
  useEffect(() => setSelectedSize(size), [size]);
  useEffect(() => setMinP(minPrice), [minPrice]);
  useEffect(() => setMaxP(maxPrice), [maxPrice]);

  const letterSizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const shoeSizes = ["35", "36", "37", "38", "39", "40", "41", "42", "43"];

  function shouldShowSize(c: string) {
    return c === "dress" || c === "jacket" || c === "shoes";
  }

  const showSize = shouldShowSize(cat);

  // Inputs tipo "pill" con la paleta GlamRent + dark mode
  const pillFieldClasses =
    "w-full rounded-full px-4 py-2.5 text-sm outline-none border border-transparent transition " +
    "bg-[#f4f3ee] text-[#463f3a] placeholder:text-[#463f3a]/60 " +
    "focus:ring-2 focus:ring-[#e0afa0] focus:border-[#e0afa0] " +
    "dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400 dark:border-slate-700";

  // Inputs rectangulares suaves (para la versión amplia) + dark mode
  const baseFieldClasses =
    "w-full rounded-2xl px-4 py-2.5 text-sm outline-none border border-transparent transition " +
    "bg-[#f4f3ee] text-[#463f3a] placeholder:text-[#463f3a]/60 " +
    "focus:ring-2 focus:ring-[#e0afa0] focus:border-[#e0afa0] " +
    "dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400 dark:border-slate-700";

  const labelTextClasses =
    "text-[11px] font-medium uppercase tracking-wide " +
    "text-[#463f3a]/60 dark:text-slate-300/80";

  // --- Layout compacto (por ejemplo en /search) ---
  if (compact) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <form
          action="/search"
          method="GET"
          className="rounded-3xl bg-[#8a817c]/90 p-4 sm:p-5 shadow-sm space-y-3 border border-[#bcb8b1]/60 dark:bg-slate-900/80 dark:border-slate-700"
        >
          {/* Fila 1: buscador + botón */}
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <div className="flex-1">
              <input
                name="q"
                value={qText}
                onChange={(e) => setQText(e.target.value)}
                placeholder="Search by style, color, or designer"
                className={pillFieldClasses}
              />
            </div>

            <button
              type="submit"
              className="md:w-[160px] w-full inline-flex items-center justify-center rounded-full bg-[#e0afa0] px-6 py-3 text-sm font-semibold text-[#463f3a] hover:bg-[#c48b8b] transition dark:text-slate-900"
            >
              {buttonText}
            </button>
          </div>

          {/* Fila 2: todos los filtros */}
          <div
            className={
              showSize
                ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-3"
                : "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3"
            }
          >
            {/* Category */}
            <div className="col-span-2 lg:col-span-2">
              <select
                name="category"
                value={cat}
                onChange={(e) => {
                  setCat(e.target.value);
                  setSelectedSize("");
                }}
                className={pillFieldClasses}
                style={{
                  WebkitAppearance: "none",
                  MozAppearance: "none",
                  appearance: "none",
                }}
              >
                <option value="">All categories</option>
                <option value="dress">Dresses</option>
                <option value="shoes">Shoes</option>
                <option value="bag">Bags</option>
                <option value="jacket">Jackets</option>
              </select>
            </div>

            {/* Size (si corresponde) */}
            {showSize && (
              <div className="col-span-1 lg:col-span-1">
                <select
                  name="size"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className={pillFieldClasses}
                  style={{
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    appearance: "none",
                  }}
                >
                  <option value="">Any size</option>
                  {cat === "shoes"
                    ? shoeSizes.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))
                    : letterSizes.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                </select>
              </div>
            )}

            {/* Style */}
            <div className="col-span-1 lg:col-span-1">
              <select
                name="style"
                defaultValue={style}
                className={pillFieldClasses}
                style={{
                  WebkitAppearance: "none",
                  MozAppearance: "none",
                  appearance: "none",
                }}
              >
                <option value="">Any style</option>
                {STYLE_OPTIONS.map((s: string) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Color */}
            <div className="col-span-1 lg:col-span-1">
              <select
                name="color"
                defaultValue={color}
                className={pillFieldClasses}
                style={{
                  WebkitAppearance: "none",
                  MozAppearance: "none",
                  appearance: "none",
                }}
              >
                <option value="">Any color</option>
                {COLOR_OPTIONS.map((c: string) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Start date */}
            <div className="col-span-1 lg:col-span-1">
              <input
                name="start"
                defaultValue={start}
                type="date"
                className={pillFieldClasses}
              />
            </div>

            {/* End date */}
            <div className="col-span-1 lg:col-span-1">
              <input
                name="end"
                defaultValue={end}
                type="date"
                className={pillFieldClasses}
              />
            </div>

            {/* Min price */}
            <div className="col-span-1 lg:col-span-1">
              <input
                name="minPrice"
                value={minP}
                onChange={(e) => setMinP(e.target.value)}
                placeholder="Min $"
                inputMode="numeric"
                className={pillFieldClasses}
              />
            </div>

            {/* Max price */}
            <div className="col-span-1 lg:col-span-1">
              <input
                name="maxPrice"
                value={maxP}
                onChange={(e) => setMaxP(e.target.value)}
                placeholder="Max $"
                inputMode="numeric"
                className={pillFieldClasses}
              />
            </div>
          </div>

          {!showSize && <input type="hidden" name="size" value="" />}
        </form>
      </div>
    );
  }

  // --- Layout amplio (por ejemplo en el home, debajo del H1) ---
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <div className="rounded-3xl bg-[#8a817c]/90 dark:bg-slate-900/80 border border-[#bcb8b1]/60 dark:border-slate-700 p-4 md:p-5 shadow-sm space-y-4">
        {/* fila principal: búsqueda + botón */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex-1">
            <input
              name="q"
              value={qText}
              onChange={(e) => setQText(e.target.value)}
              placeholder="Search by style, color, or designer"
              className={pillFieldClasses}
            />
          </div>

          <button
            type="submit"
            className="md:w-auto w-full rounded-full bg-[#e0afa0] px-6 py-3 text-sm font-semibold text-[#463f3a] shadow-sm hover:bg-[#c48b8b] transition dark:text-slate-900"
          >
            {buttonText}
          </button>
        </div>

        {/* filtros */}
        <div className="space-y-4 bg-[#f4f3ee]/20 dark:bg-slate-900/60 rounded-2xl p-3">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3">
            <label className="flex flex-col gap-1">
              <span className={labelTextClasses}>Category</span>
              <select
                name="category"
                value={cat}
                onChange={(e) => {
                  setCat(e.target.value);
                  setSelectedSize("");
                }}
                className={baseFieldClasses}
              >
                <option value="">All</option>
                <option value="dress">Dresses</option>
                <option value="shoes">Shoes</option>
                <option value="bag">Bags</option>
                <option value="jacket">Jackets</option>
              </select>
            </label>

            {showSize && (
              <label className="flex flex-col gap-1">
                <span className={labelTextClasses}>Size</span>
                <select
                  name="size"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className={baseFieldClasses}
                >
                  <option value="">Any</option>
                  {cat === "shoes"
                    ? shoeSizes.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))
                    : letterSizes.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                </select>
              </label>
            )}

            <label className="flex flex-col gap-1">
              <span className={labelTextClasses}>Style</span>
              <select
                name="style"
                defaultValue={style}
                className={baseFieldClasses}
              >
                <option value="">Any style</option>
                {STYLE_OPTIONS.map((s: string) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className={labelTextClasses}>Color</span>
              <select
                name="color"
                defaultValue={color}
                className={baseFieldClasses}
              >
                <option value="">Any color</option>
                {COLOR_OPTIONS.map((c: string) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {!showSize && <input type="hidden" name="size" value="" />}

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3">
            <label className="flex flex-col gap-1">
              <span className={labelTextClasses}>Min price</span>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[#463f3a]/50 dark:text-slate-400 text-xs">
                  $
                </span>
                <input
                  name="minPrice"
                  value={minP}
                  onChange={(e) => setMinP(e.target.value)}
                  placeholder="From"
                  inputMode="numeric"
                  className={`${baseFieldClasses} pl-7`}
                />
              </div>
            </label>

            <label className="flex flex-col gap-1">
              <span className={labelTextClasses}>Max price</span>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[#463f3a]/50 dark:text-slate-400 text-xs">
                  $
                </span>
                <input
                  name="maxPrice"
                  value={maxP}
                  onChange={(e) => setMaxP(e.target.value)}
                  placeholder="To"
                  inputMode="numeric"
                  className={`${baseFieldClasses} pl-7`}
                />
              </div>
            </label>

            <label className="flex flex-col gap-1">
              <span className={labelTextClasses}>From</span>
              <input
                name="start"
                defaultValue={start}
                type="date"
                className={baseFieldClasses}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className={labelTextClasses}>To</span>
              <input
                name="end"
                defaultValue={end}
                type="date"
                className={baseFieldClasses}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
