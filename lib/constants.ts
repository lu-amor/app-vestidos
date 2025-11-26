export const STYLE_OPTIONS = [
  "evening",
  "black-tie",
  "daytime",
  "cocktail",
  "Elegant",
  "Formal",
  "Bohemian",
  "Glamorous",
] as const;
export type StyleOption = (typeof STYLE_OPTIONS)[number];

export const COLOR_OPTIONS = [
  "Champagne",
  "Black",
  "Floral",
  "Burgundy",
] as const;
export type ColorOption = (typeof COLOR_OPTIONS)[number];
