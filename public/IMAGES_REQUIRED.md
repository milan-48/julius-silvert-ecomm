# Images to Export from Figma → `/public` folder

Section-by-section list of assets to export from your Figma design.

---

## Section 1: Announcement Bar
No images required. Uses text and links only.

---

## Section 2: Main Header (Logo + Search + Icons)

| File Name | Location in Design | Notes |
|-----------|--------------------|-------|
| `logo.svg` | Logo area (left) | **Optional.** If you use a graphic logo instead of text, export and place here. Currently using text: "JULIUS SILVERT" + "Est. 1915". |

**Icons:** Using `lucide-react` (search, heart, user, cart, menu). No export needed unless you want custom Figma icons.

---

## Section 3: Navigation Bar
No images required. Text links only.

---

## Section 4: Hero Section

**Default:** Hero carousel images are **`imageSrc` URLs** in `lib/constants.js` (`HOME_HERO_SLIDES`) — Unsplash placeholders so the site works with **no files in `/public`**. `next.config.mjs` allows `images.unsplash.com`.

**Optional — your brand photography:** Replace any slide’s `imageSrc` with a path under `/public` (e.g. `/assets/my-hero.webp`) and export a wide shot (~1920px+ on the long edge).

---

## Section 5: Category Cards
No images required. Text labels only (Beef, Pork, Poultry, etc.).

---

## Summary – Must Export

| Priority | File | Section |
|----------|------|---------|
| — | *(none required for hero)* | Hero uses Unsplash URLs in `constants.js` |
| Optional | `logo.svg` | Header |
| Optional | Custom hero/promo assets | Replace `imageSrc` in `constants.js` |
