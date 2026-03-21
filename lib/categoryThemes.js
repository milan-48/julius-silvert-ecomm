/**
 * Per-slug category tiles — **muted neutrals** only (no rainbow pastels).
 * Tiny background shifts keep cards distinguishable without strong color.
 */

const NEUTRAL_BORDER = "rgba(229, 231, 235, 0.95)";

function tone(from, to) {
  return {
    from,
    to,
    border: NEUTRAL_BORDER,
  };
}

export const CATEGORY_THEME_BY_SLUG = {
  "whats-new": {
    icon: "Sparkles",
    ...tone("#fafafa", "#f5f5f5"),
  },
  "meat-poultry": {
    icon: "Beef",
    ...tone("#fafaf9", "#f5f5f4"),
  },
  "dairy-eggs": {
    icon: "Milk",
    ...tone("#fafafa", "#f4f4f5"),
  },
  "cheese-charcuterie": {
    icon: "Wine",
    ...tone("#f9faf9", "#f4f5f4"),
  },
  "oils-vinegars": {
    icon: "Droplet",
    ...tone("#f8faf9", "#f3f4f4"),
  },
  "baking-pastry": {
    icon: "Wheat",
    ...tone("#faf9f7", "#f5f4f2"),
  },
  produce: {
    icon: "LeafyGreen",
    ...tone("#f7faf8", "#f2f5f3"),
  },
  frozen: {
    icon: "Snowflake",
    ...tone("#f8fafb", "#f3f5f6"),
  },
  seafood: {
    icon: "Fish",
    ...tone("#f7f9fa", "#f2f4f5"),
  },
  pantry: {
    icon: "Package",
    ...tone("#f9f8fa", "#f4f3f5"),
  },
  supplies: {
    icon: "ShoppingBasket",
    ...tone("#f7f7f8", "#f2f2f3"),
  },
  "family-meal-specials": {
    icon: "Users",
    ...tone("#faf8f9", "#f5f3f4"),
  },
};

export const CATEGORY_CARD_FALLBACK_THEME = {
  icon: "LayoutGrid",
  ...tone("#fafafa", "#f4f4f5"),
};
