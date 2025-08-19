# Images directory

Place all static images used by the site in this "public/images" folder.

Why here?
- Next.js serves everything in the "public" folder at the web root.
- Files in "public/images" are accessible via paths like "/images/your-file.jpg".
- Works seamlessly with the Next.js <Image> component for optimization.

Recommended structure:
- public/
  - images/
    - dresses/         # dress photos for listings
    - logos/           # brand assets
    - hero/            # hero/marketing imagery

Usage in code:
- Use Next.js Image: <Image src="/images/dresses/silk-evening-gown.jpg" alt="Silk evening gown" ... />
- Or a plain <img src="/images/dresses/silk-evening-gown.jpg" alt="..." />

Recommendations:
- Prefer .webp (smaller) or high-quality .jpg.
- Card images: 3:4 aspect ratio (e.g., 1200x1600).
- Name files with lowercase-dashes, e.g., "silk-evening-gown.jpg".

Example filenames referenced in code:
- /images/dresses/silk-evening-gown.jpg
- /images/dresses/black-tie-dress.jpg
- /images/dresses/floral-midi-dress.jpg
- /images/dresses/velvet-cocktail-dress.jpg
