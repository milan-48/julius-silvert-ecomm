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

| File Name | Description | Export Settings |
|-----------|--------------|-----------------|
| **`assets/herosection.png`** | Full-width hero photo (e.g. artichokes) | High quality PNG or WebP; wide aspect (~2:1) works well |

Place hero imagery under **`/public/assets/`** (not the repo root). The app references **`/assets/herosection.png`**.

Legacy **`hero-artichokes.jpg`** is optional if you prefer JPG; update `Hero.js` `src` if you switch.

---

## Section 5: Category Cards
No images required. Text labels only (Beef, Pork, Poultry, etc.).

---

## Summary – Must Export

| Priority | File | Section |
|----------|------|---------|
| **Required** | `assets/herosection.png` | Hero |
| Optional | `logo.svg` | Header |
